import { getBabelInputPlugin } from "@rollup/plugin-babel";

export default async function (args) {
    const defaultConfig = args.configDefaultConfig;

    // Extend each config to handle TypeScript from @treegraphwidgets packages
    return defaultConfig.map(config => {
        // Find the getBabelInputPlugin and ensure it processes @treegraphwidgets packages
        const modifiedPlugins = config.plugins.map(plugin => {
            // The babel input plugin needs to handle TypeScript from @treegraphwidgets
            if (plugin && plugin.name === "babel") {
                const sourceMaps = config.output.sourcemap !== false;
                return getBabelInputPlugin({
                    sourceMaps,
                    babelrc: false,
                    babelHelpers: "bundled",
                    extensions: [".js", ".jsx", ".ts", ".tsx"],
                    plugins: ["@babel/plugin-proposal-class-properties"],
                    presets: [
                        ["@babel/preset-typescript", { isTSX: true, allExtensions: true }]
                    ],
                    overrides: [
                        {
                            // Handle TypeScript in @treegraphwidgets packages
                            test: /@treegraphwidgets/,
                            presets: [
                                ["@babel/preset-typescript", { isTSX: true, allExtensions: true }]
                            ],
                            plugins: [
                                "@babel/plugin-transform-typescript",
                                ["@babel/plugin-transform-react-jsx", {
                                    runtime: "automatic",
                                    importSource: "react"
                                }]
                            ]
                        },
                        {
                            test: /node_modules/,
                            exclude: /@treegraphwidgets/,
                            plugins: ["@babel/plugin-transform-flow-strip-types", "@babel/plugin-transform-react-jsx"]
                        },
                        {
                            exclude: /node_modules/,
                            plugins: [["@babel/plugin-transform-react-jsx", {
                                runtime: "automatic",
                                importSource: "react"
                            }]]
                        }
                    ]
                });
            }
            return plugin;
        });

        return {
            ...config,
            plugins: modifiedPlugins
        };
    });
}