//引入gulp
var gulp=require("gulp");
//合并文件
var concat=require("gulp-concat");
//压缩js
var uglify=require("gulp-uglify");
//开启服务
var webserver=require("gulp-webserver");
//编译sass
var sass=require("gulp-sass");
//压缩css
var minify=require("gulp-minify-css");

// 引入gulp-webpack
var webpack = require("gulp-webpack");
// 引入named
var named = require("vinyl-named");

// 引入版本控制插件
var rev = require("gulp-rev");

// 引入自动替换文件名
var revCollector = require("gulp-rev-collector");

// 引入url
var url = require("url");

// 引入fs 
var fs = require("fs");



//启动服务
gulp.task("webserver",function(){
	gulp.src("./")  //在什么下启服务
		.pipe(webserver({
			port:80,  //改变端口
			livereload:true,//页面保存，浏览器自动更新
			directoryListing:{
				enable:true,  //显示目录
				path:"./"	  //显示该路径下的
			}
		}))
})

//构建压缩任务
gulp.task("uglify",function(){
	gulp.src("./app/dist/iscroll.js")
		.pipe(uglify())
		.pipe(gulp.dest("./app/src/scrollmin"))//生成文件夹
})

var sassfiles=["./app/src/style/**/*.scss"];
var cssfiles = ["./app/src/style/*.css"];
var jsfiles = ["./app/src/script/app.js"];

//编译文件
gulp.task("sass",function(){
	gulp.src(sassfiles)//要编译的路径
	    .pipe(sass())  //编译
	    .pipe(minify()) //压缩css
        .pipe(gulp.dest("./app/prd/styles"));//压缩目录
})

//压缩css
gulp.task("css",function(){
	gulp.src(cssfiles)
	    .pipe(minify())
	    .pipe(gulp.dest("./app/prd/styles"));
})

// 实现JS模块化
gulp.task("packjs",function(){
	gulp.src(jsfiles)//入口js
		.pipe(named())//完成名字覆盖，因为本身会默认产生mian.js
		.pipe(webpack({
			output:{//输出
				filename:'[name].js'
			},
			modules:{
        		loaders:[
                  {
                  	test:/\.js$/,
                  	loader:'imports?define=>false'
                  }
        		]
        	}
		}))
		.pipe(uglify().on("error",function(e){
			console.log("\x07",e.lineNumber,e.message)//手写系统报错
			return this.end();
		}))
		.pipe(gulp.dest("./app/prd/scripts"))
});

//版本控制（上线时才干，所以不要添加到默认执行事件里
var cssDistFiles = ["./app/prd/styles/index.css"];//入口css
var jsDistFiles = ["./app/prd/scripts/app.js"];//入口js
gulp.task("ver",function(){
    gulp.src(cssDistFiles)
        .pipe(rev())   // 生成name-md5文件
        .pipe(gulp.dest("./app/prd/styles"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("./app/ver/styles"))
    gulp.src(jsDistFiles)
        .pipe(rev())   // 生成name-md5文件
        .pipe(gulp.dest("./app/prd/scripts"))
        .pipe(rev.manifest())
        .pipe(gulp.dest("./app/ver/scripts"))
})
// 让html文件自动将入口文件的文件名替换为md5加密之后的名称
gulp.task("html",function(){
	gulp.src(["./app/ver/**/*.json","./app/*.html"])
	    //先写要把谁引进来    再写改掉谁里的链接
	    .pipe(revCollector())
	    .pipe(gulp.dest("./app"));
})

gulp.task("min",["ver","html"]);//单独执行事件

//监测任务
gulp.task("watch",function(){
		
	gulp.watch(sassfiles,["sass"])
	gulp.watch(cssfiles,["css"]);
	gulp.watch("./app/src/script/**/*.js",["packjs"]);
})

//默认执行任务
gulp.task("default",["watch","uglify","webserver"])