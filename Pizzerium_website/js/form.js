function validation(){
    var name = document.getElementById("name").value;
    var mail = document.getElementById("mail").value;
    if(name == ""){
        document.getElementById("iname").innerHTML = "Wpisz swoje imię";
        return false;
    } else if (mail == ""){
        document.getElementById("imail").innerHTML = "Wpisz swój adres e-mail";
        return false;
    } else {
        runGameOnSubmit();
        return false;
    } 
}