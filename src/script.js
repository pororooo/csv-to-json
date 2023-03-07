//Создайте объект-конструктор (класс), который содержит информацию о парковках (адрес, количество мест, телефон, стоимость)
class Parking {
    constructor(adress, count, phone, cost) {
      this.adress = adress;
      this.count = count;
      this.phone = phone;
      this.cost = cost;
    }
  
    input() {
        console.log(this.adress + ' ' + this.count + ' ' + this.phone + ' ' + this.cost)
    }
} 


//Создайте экземпляр объекта, выполнив ввод данные с помощью диалогового окна prompt.
adress = prompt('Введите адрес: ');
count = +prompt('Введите количество мест: ');
phone = prompt('Введите телефон: ');
cost = +prompt('Введите стоимость: ');

var elems1=[];
let parking1 = new Parking(adress, count, phone, cost);
elems1.push(parking1);

//По нажатия на кнопку, преобразуйте созданный объект JavaScript в JSON-строку.
//Выведите полученное строковое значение, выполнив встраивание текстового содержимого в HTML-элемент.
let butt1 = document.getElementById('butt1');
butt1.addEventListener('click', convert1);
var str;

function convert1(){
    str = JSON.stringify(elems1);
    document.getElementById('out1').innerHTML = 'Строка: ' + str;
    console.log(typeof(str));
}

//Преобразуйте созданную JSON-строку назад в объект JavaScript таким образом, чтобы полученный объект содержал только те свойства, для которых значение свойств имеет тип string.
let butt2 = document.getElementById('butt2');
butt2.addEventListener('click', convert2);

function convert2(){
    document.getElementById('out2').innerHTML += 'Строковые элементы объекта: ';
    const elems2 = JSON.parse(str, function(key, value) {
        if (typeof(value) === "number") {
            console.log('no');
        }else{
            return value;
        }
    });

    console.log(elems2[0]);
    console.log(typeof(elems2));

    for(let i in elems2[0]){
        document.getElementById('out2').innerHTML += (elems2[0][i]);
        document.getElementById('out2').innerHTML += ' ';
    }    

};
