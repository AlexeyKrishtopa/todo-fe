export const responseLogger = (res) => {
  console.group('       Response Logger       ')
  console.log(res)
  console.groupEnd()
}
