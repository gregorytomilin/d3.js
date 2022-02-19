'use strict';
const { src, dest, task, series, watch } = require("gulp");

const rename = require('gulp-rename');



// SCSS
const sass = require('gulp-sass')(require('sass'));
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const gcmq = require('gulp-group-css-media-queries');
const cleanCSS = require('gulp-clean-css');
const removeComments = require ('gulp-strip-css-comments');



task('scss', () => {
    return src(['src/scss/styles.scss']) // берём главный css
        .pipe(sass({
            outputStyle: 'expanded',  // вложенный (по умoлчанию)
        }).on('error', sass.logError))
        .pipe(sourcemaps.init())
        .pipe(gcmq())
        .pipe(removeComments())
        .pipe(cleanCSS())
        // .pipe(concat('style.css'))
        .pipe(dest('dist/css'));      // выгружаем результат
});

const include = require('gulp-include');

task('js', () => {
        return src('src/js/main.js')
            .pipe(include())
            .on('error', console.log)
            .pipe(dest('dist/js'))
    }
)

task('watch', ()=>{
    watch(['src/scss/**/*.scss'],series(['scss']));
    watch(['src/js/**/*.js'], series(['js']));

})

