function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomLetter() {
    const number = getRandomInt(0, 1);
    return ["O", "X"][number];
}

function takeOtherLetter(letter){
    if(letter === "X"){
        return "O";
    } else {
        return "X";
    }
}

export {getRandomInt, getRandomLetter, takeOtherLetter};