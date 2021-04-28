let parsedDate = function(date){
    let yyyy = date.getFullYear()
    let mm = String(date.getMonth() + 1) //January is 0!
    let dd = String(date.getDate())
    if(mm<10){
        mm = '0' + mm
    }
    if(dd<10){
        dd = '0' + dd
    }
    return `${yyyy}-${mm}-${dd}`
}
export default parsedDate
