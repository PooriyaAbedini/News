getDate = ()=>{

    const today = new Date();
    
    option ={
        weekday: "long",
        day: "numeric",
        month: "long"
    }
    
    const date =  today;


  return date.toString();
};

var todaysDate = getDate();

module.exports = todaysDate.slice(0,15);