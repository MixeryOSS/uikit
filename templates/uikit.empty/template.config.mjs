import * as path from "node:path";
import * as fs from "node:fs";
import * as cproc from "node:child_process";

const GITIGNORE = `/dist
/node_modules
**.swp
`;

export async function generate(rootDir, cli) {
    const name = await cli.prompt("Package name", {
        check: name => (name.length <= 214 && name.match(/^([^\._@]|@[a-z0-9\-_\.\~]+\/)[a-z0-9\-_\.\~\/]+$/)),
        defValue: path.basename(rootDir),
        required: true
    });
    const author = await cli.prompt("Author");
    const version = await cli.prompt("Package version", {
        defValue: "1.0.0",
        required: true
    });
    const desc = await cli.prompt("Description");
    const type = await cli.prompt("Package type (classic/module)", {
        check: name => ["classic", "module"].includes(name),
        defValue: "module"
    });
    const keywords = await cli.prompt("Keywords", {
        apply: inp => inp.split(" ").filter(v => v)
    });
    let repo = await cli.prompt("Git repository");
    const license = await cli.prompt("License", {
        defValue: "MIT",
        required: true
    });

    // #region package.json
    const esbFormat = type == "module"? "--format=esm" : "";
    const packageInfo = {
        name, version,
        main: "dist/index.js",
        files: [
            "/dist/**/*.js",
            "/dist/**/*.d.ts",
            "!/dist/bundle.js"
        ],
        scripts: {
            "test": "node dist/test.js",
            "build:package": "tsc -b",
            "build:package:watch": "tsc -w",
            "build:bundle": `esbuild --bundle src/page.tsx ${esbFormat} --outfile=dist/bundle.js`,
            "build:bundle:watch": `esbuild --bundle src/page.tsx ${esbFormat} --watch --outfile=dist/bundle.js`,
            "build:bundle:prod": `esbuild --bundle src/page.tsx ${esbFormat} --minify --tree-shaking --outfile=dist/bundle.js`
        },
        keywords: keywords ?? [],
        license
    };

    if (desc) packageInfo.description = desc;
    if (type == "module") packageInfo.type = "module";
    if (author) packageInfo.author = author;
    if (repo) {
        packageInfo.repository = {
            type: "git",
            url: `git+${repo}`
        };

        if (repo.match(/^https?\:\/\/github.com/)) {
            if (repo.endsWith(".git")) repo = repo.substring(0, repo.indexOf(".git"));
            packageInfo.bugs = { url: `${repo}/issues` };
            packageInfo.homepage = `${repo}#readme`
        }
    }
    // #endregion
    // #region tsconfig.json
    const tsconfig = {
        compilerOptions: {
            module: type == "module"? "NodeNext" : "CommonJS",
            target: "ESNext",
            outDir: "dist",
            incremental: true,
            declaration: true,
            jsx: "react",
            jsxFactory: "UIKit.createElement",
            jsxFragmentFactory: "UIKit.fragment"
        },
        include: ["src"],
        exclude: ["node_modules"]
    };
    // #endregion
    
    await Promise.all([
        fs.promises.writeFile(path.join(rootDir, "package.json"), JSON.stringify(packageInfo, null, 2)),
        fs.promises.writeFile(path.join(rootDir, "tsconfig.json"), JSON.stringify(tsconfig, null, 4)),
        fs.promises.writeFile(path.join(rootDir, ".gitignore"), GITIGNORE)
    ]);

    cli.info("Installing packages...");
    function runNpm(...args) {
        const spawnResult = cproc.spawnSync("npm", args, { cwd: rootDir });
        if (!!spawnResult.status) {
            cli.info(spawnResult.stdout.toString());
            cli.error(`npm exit with code (${spawnResult.status})`);
            process.exit(1);
        }
    }

    runNpm("install", "@mixery/uikit", "@mixery/state-machine");
    runNpm("install", "--save-dev", "typescript", "esbuild");
    
    cli.info("You're all set!");
    cli.info("- build:package to build as npm package, build:package:watch to watch for changes");
    cli.info("- build:bundle to build dist/bundle.js, build:bundle:watch to watch");
    cli.info("- build:bundle:prod to build dist/bundle.js for production use");
}
