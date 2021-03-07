const formattedDate = (time) => {
  return time ? new Date(time).toLocaleDateString().replace(/\//g, '-'): ''

}
export default formattedDate
