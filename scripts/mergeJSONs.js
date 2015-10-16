var arr = [], //to collect id values 
    collection = []; //collect unique object

$.each(json_all, function (index, value) {
    if ($.inArray(value.id, arr) == -1) { //check if id value not exits than add it
        arr.push(value.id);//push id value in arr
        collection.push(value); //put object in collection to access it's all values
    }
});
console.log(collection); //you can access it values like collection[index].keyName
console.log(arr);