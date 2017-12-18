const gulp = require('gulp');
const bs = require('browser-sync');

gulp.task('watch',function(){
  gulp.watch('./*').on('change',bs.reload)

})
gulp.task('bs',function(){
  bs.init({
    server: {
      port: 3000,
      baseDir: './',
      index: 'index.html'
    }
  })
})
gulp.task('default',['bs','watch'],function(){
  console.log('..gulp default')
})