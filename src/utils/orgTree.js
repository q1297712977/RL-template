const changeOrgTree = (data) => {
    data.forEach((item)=>{
        item.scopedSlots= { title: 'custom' }
        // console.log(item)
        if(item.children!=undefined&&item.children.length!=0) changeOrgTree(item.children)
        // return item
    })
    // console.log(data)
    return data
}
export default changeOrgTree