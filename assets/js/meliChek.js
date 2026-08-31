function myfunction() {
    var xv = document.getElementById('Your-id').value;
    if (isNaN(xv)) {
        alert("please enter a number !");
    } else if (xv == "") {
        alert("please write a code !")
    } else if (xv.length < 10) {
        alert("your entered code is less than 10!")
    } else {
        var yy = 0;
        var yv = parseInt(yv);
        for (let i = 0; i < xv.length; i++) {
            yv = xv[i] * (xv.length - i);
            yy += yv;
        }
        var x = yy % 11;
        if (x === 0) {
            alert("your code is valid !");
        } else {
            alert("your code is invalid !");
        }
        yy = 0;
    }
}