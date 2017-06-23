const gulp = require('gulp');
const eslint = require('gulp-eslint');
const exec = require('child_process').exec;

gulp.task('default', () => {
  process.stdout.write('\nAll available gulp tasks: \n');
  Object.keys(gulp.tasks).forEach((task) => {
    process.stdout.write(`gulp ${task} \n`);
  });
  process.stdout.write('\n');
});

/* eslint-arrow-bodystyle: ["error", "as-needed"] */
gulp.task('lint', () => (
  gulp.src(['**/*.js', '!node_modules/**'])
    .pipe(eslint({ fix: true }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError())
));

gulp.task('clean', (done) => {
  exec('rm -rf .nyc_output/ && rm -rf coverage/', (err) => {
    done(err);
  });
});
