require.config({

	baseUrl: "js",

	paths: {
		lodash: "vendor/lodash/dist/lodash.underscore.min",
		jquery: "vendor/jquery/jquery.min",
		pixi: "vendor/pixi/bin/pixi.dev"
	},

	shim: {
		pixi: {
			deps: [],
			exports: "PIXI"
		}
	}
});

define(
	[
		'./app'
	],
	function (App) {
		(new App("#whale")).run();
	}
);
