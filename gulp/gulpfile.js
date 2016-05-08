var imgSprite = true;
var gulp = require('gulp');
var thumbnail = require('gulp-jingoal-thumbnail');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var sprite = require('jingoal-sprite');
var Q = require('q');
var pack = require("gulp-require-jingoal");
gulp.task('sasstask', function () {
    gulp.src('../static/css/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss([
            require('postcss-jingoal')
        ]))
        .pipe(gulp.dest('../static/dest/css'));
});
/*缩略图*/
gulp.task('thumbnailtask', function () {
    return gulp.src('../static/dest/imgs/2x/*.png')
        .pipe(thumbnail("../1x"));
});
/*图片位置map*/
gulp.task('fileMap',["thumbnailtask"], function () {
    return gulp.src('../static/dest/imgs/2x/*.png').pipe(sprite.fileMap());
});
/*requirejs 打包*/
gulp.task('requirejs',function () {
    gulp.src('../twStatic/**/*.*').pipe(pack('twStatic')).pipe(gulp.dest('../dest/twStatic'))
    gulp.src('../static/**/*.*').pipe(pack('static')).pipe(gulp.dest('../dest/static'))
    return gulp.src('../public/**/*.*').pipe(pack('static')).pipe(gulp.dest('../dest/public'));
});
/*生成sprite*/
gulp.task('spritetask', ["sasstask","fileMap"], function () {
    sprite.createSprite(function () {
        gulp.src('../static/dest/css/*.css')
            .pipe(postcss([
                require('postcss-jingoal-sprite')
            ]))
            .pipe(gulp.dest('../static/dest/css'));
    });
});
gulp.task('watch', function () {
    gulp.watch('../static/css/**/*.scss', ['sasstask']);
    gulp.watch('../static/dest/imgs/2x/*.png', ['thumbnailtask']);
});
gulp.task('default', ['watch']);
gulp.task('sass', ['sasstask']);
gulp.task('sprite', ['spritetask']);
gulp.task('pack', ['requirejs']);
