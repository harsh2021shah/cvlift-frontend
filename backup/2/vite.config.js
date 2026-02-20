import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ command, mode, ssrBuild }) => ({
	base: "/",
	// Getting rid of hashes in generated filenames
	// filenameHashing: false, // Vite doesn't have this option directly, usually handled by rollupOptions
	build: {
		// cssMinify: false, // disable CSS mininfy only
		// minify: false, // disable CSS/JS mininfy only
		// change output location
		rollupOptions: {
			input: {
				main: resolve(__dirname, 'index.html'),
				help: resolve(__dirname, 'help.html'),
			},
			output: {
				manualChunks: undefined,
				assetFileNames: "assets/[name].[ext]", // Output assets (e.g., images, SVGs) to the assets folder
				entryFileNames: "assets/[name].js", // Output entry files (e.g., JavaScript) to the root directory
				chunkFileNames: "assets/[name].js", // Output dynamic imports (chunks) to the assets folder
			},
		},
	},

	server: {
		// open the server with default browser
		open: true,
	},
	resolve: {
		alias: {
			"@": resolve(__dirname, "src"),
			"~gerillass": resolve(__dirname, "node_modules/gerillass/scss/gerillass.scss"),
		},
	},
	plugins: [],
}));
