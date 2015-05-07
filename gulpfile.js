var gulp = require('gulp');
var traceur = require('gulp-traceur');

gulp.task('build', function () {
    return gulp.src('scripts/*.js')
        .pipe(traceur())
        .pipe(gulp.dest('build'));
});