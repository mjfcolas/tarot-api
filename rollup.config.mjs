import typescript from '@rollup/plugin-typescript';
import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

const config = [
    {
        input: 'src/web/endpoints.ts',
        output: {
            file: 'dist/server.js',
            format: 'cjs'
        },
        plugins: [commonjs(), json(), typescript({ module: "es2015" }), nodeResolve()]
    }
]

export default config
