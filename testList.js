let testL = [[1,3,4],[1,3,4],[1,7,2]]
let str =""
for(const itm in testL){
    str +=JSON.stringify(testL[itm]) +"\n"
}
console.log(str)