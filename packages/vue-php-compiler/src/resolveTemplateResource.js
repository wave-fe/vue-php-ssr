import path from 'path';
import fs from 'fs';
import {runLoaders} from 'loader-runner';
import asyncReplace from 'async-replace';

import {
    webpackConfigPath
} from './config';

import {
    getWebpackConfig
} from './utils';

const defaultOptions = {
  video: ['src', 'poster'],
  source: 'src',
  img: 'src',
  image: 'xlink:href'
}

let resolvedLoaders = resolveLoaders();

function resolveLoaders() {
    let rules = getWebpackRules();
    let dir = path.parse(webpackConfigPath).dir;
    function getLoaderStr(loaderName, options) {
        return require.resolve(loaderName, { paths: [dir] }) + '?' + JSON.stringify(options);
    }
    return rules.map(function (rule) {
        if (rule.loader) {
            return {
                test: rule.test,
                loader: getLoaderStr(rule.loader, rule.options)
            };
        }
        else if (rule.use) {
            return {
                test: rule.test,
                loader: rule.use.map(item => getLoaderStr(item.loader, item.options)).join('!')
            };
        }
    })
}

function getLoaders(url) {
    return resolvedLoaders.filter(loader => loader.test.test(url)).map(item => item.loader);
}

function getWebpackRules() {
    let webpackConfig = getWebpackConfig();
    if (!webpackConfig) {
        return [];
    }
    return webpackConfig.module.rules || [];
}

function getVueOptions() {
    let rules = getWebpackRules();
    let vueConfig = rules.find(function (rule) {
        return rule.test.test('a.vue');
    });
    if (!vueConfig) {
        return;
    }
    return vueConfig.options;
}

function transformNode(node, tags) {
  for (const tag in tags) {
    if ((tag === '*' || node.tag === tag) && node.attrs) {
      const attributes = tags[tag]
      if (typeof attributes === 'string') {
        node.attrs.some(attr => rewrite(attr, attributes));
      } else if (Array.isArray(attributes)) {
        attributes.forEach(item => node.attrs.some(attr => rewrite(attr, item)));
      }
    }
  }
}

function rewrite (attr, name) {
    if (attr.name === name) {
        const value = attr.value
        // only transform static URLs
        if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {

            attr.value = `__resolveResource(${value})`;
            return true
        }
    }
}
export function markResource() {
    let vueOptions = getVueOptions() || {};
    let options = Object.assign({}, defaultOptions, vueOptions);

    return {
        postTransformNode: function (node) {
            transformNode(node, options);
        }
    };
}


export function resolveTemplateResource(code, {dir}) {
    return new Promise(function (resolve, reject) {
        let webpackConfig = getWebpackConfig();
        let publicPath;
        if (webpackConfig && webpackConfig.output) {
            publicPath = webpackConfig.output.publicPath;
        }
        else {
            publicPath = '/';
        }
        asyncReplace(
            code,
            /__resolveResource\(([^)]+)\)/g,
            function (all, url, offset, string, done) {
                if (webpackConfig) {
                    let originUrl = url;
                    url = path.resolve(dir, JSON.parse(url));
                    let loaders = getLoaders(url);
                    runLoaders({
                        resource: url,
                        loaders: loaders,
                        context: {
                            emitFile:function () {
                            }
                        },
                        readResource: fs.readFile.bind(fs)
                    }, function (err, data) {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        let code = data.result[0];
                        if (Buffer.isBuffer(code)) {
                            done(null, originUrl);
                            return;
                        }
                        code = 'var __webpack_public_path__ = \'' + publicPath + '\';' + code.replace(/module\.exports\s*=/, '');
                        done(null, JSON.stringify(eval(code)));
                    });
                }
                else {
                    done(null, url);
                }
            },
            function (err, str) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(str);
                }
            }
        );
    });
}
