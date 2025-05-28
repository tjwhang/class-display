
function Display() {
    const name = "tjwhang";
    if (name) {
        return <h1>Hello, {name}</h1>;
    }
    else {
        return <h1>Hello, user!</h1>
    }
    
}

export default Display;