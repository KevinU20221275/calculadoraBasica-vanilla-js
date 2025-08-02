/**
 * Clase Calculadora - Maneja la lógica y operaciones de una calculadora básica
 */
class Calculadora {
    /**
     * Constructor de la clase Calculadora
     * @param {HTMLElement} valorPrevioTextElement - Elemento HTML que muestra el valor previo
     * @param {HTMLElement} valorActualTextElement - Elemento HTML que muestra el valor actual
     */
    constructor(valorPrevioTextElement, valorActualTextElement) {
        // Almacena referencias a los elementos del DOM para mostrar los valores
        this.valorPrevioTextElement = valorPrevioTextElement
        this.valorActualTextElement = valorActualTextElement
        // limita la cantidad de digitos en la pantalla
        this.limiteDigitos = 11
        /*por eso necesito esta propiedad me servira para iniciar una nueva operacion al precionar un numero despues de haber presionado =
        y para mostrar el resultaod final */
        this.ultimaAccion = ""
        // propiedad para guardar la opeacion completa
        this.opeacionCompleta = ""
        // Inicializa la calculadora limpiando todos los valores
        this.borrarTodo()
    }

    /**
     * Limpia todos los valores de la calculadora, resetea a estado inicial
     */
    borrarTodo() {
        this.valorActual = ''      // Valor que se está ingresando actualmente
        this.valorPrevio = ''      // Valor que se usará para la operación
        this.operacion = undefined // Tipo de operación seleccionada (+, -, x, ÷)
        this.ultimaAccion = "" // ultima accion que se realizo (para detectar si se preciono el boton =)
        this.opeacionCompleta = "" // limpia la operacion
    }

    /**
     * Elimina el último dígito del valor actual
     */
    borrar() {
        // Convierte a string y remueve el último carácter usando slice
        this.valorActual = this.valorActual.toString().slice(0, -1)
    }

    /**
     * agrega la operacion de '=' a la propiedad ultimaAccion solo cuando se preciona el boton igual,
     * necesito esta propiedad para saber si el resultado en pantalla es producto de haber precionado = y no por 
     * la concatenacion de operaciones es decir (7 + 7 - 3 - 12) esto tambien va mostrando un total sin necesidad de haber precionado =
    */
    setIgual(){
        this.ultimaAccion = '='
    }

    /**
     * Agrega un número (dígito) al valor actual que se está ingresando
     * @param {string} numero - El dígito o punto decimal a agregar
     */
    agregarNumero(numero) {
        // si la ultima accion fue precionar el boton igual al agregar un nuevo numero se reinicia la operacion
        if (this.ultimaAccion === '='){
            this.borrarTodo()
        }
        // evita seguir agregando numeros si ya igualo el limite de digitos permitidos
        if (this.valorActual.length >= this.limiteDigitos) return
        // Evita agregar múltiples puntos decimales
        if (numero === '.' && this.valorActual.includes('.')) return
        // Concatena el nuevo número al valor actual
        this.valorActual = this.valorActual.toString() + numero.toString()
        // agrega el nuevo numero a la cadena de operacion completa
        this.opeacionCompleta += numero
    }

    /**
     * Selecciona la operación matemática a realizar
     * @param {string} operacion - El símbolo de la operación (+, -, x, ÷)
     */
    elejirOperacion(operacion) {
        // No hacer nada si no hay valor actual ingresado
        if (this.valorActual === '') return

        // this.valorActual sea NaN cuando tenga el mensaje de error (Math Error por la divicion por cero) 
        // por eso reinicia la operacion
        if (isNaN(parseFloat(this.valorActual))){
            this.borrarTodo()
            return
        }

        // guarda la ultima accion/operacion
        this.ultimaAccion = operacion
        // almecena la operacion que se esta llevando acabo
        this.opeacionCompleta += operacion

        // ejecuta calcular si la operacion es '%' por separado por que se puede ejecutar con un solo valor o ambos
        if ((this.valorActual !== '' || this.valorPrevio !== '') && operacion ==='%'){
            this.operacion = operacion
            this.calcular()
            return
        }

        // Si ya hay un valor previo, calcular el resultado de la operación anterior
        if (this.valorPrevio !== '') {
            this.calcular()
        }
        // Almacena la operación seleccionada
        this.operacion = operacion
        // Mueve el valor actual al valor previo para la operación
        this.valorPrevio = this.valorActual
        // Limpia el valor actual para ingresar el siguiente número
        this.valorActual = ''
    }


    /**
     * Realiza el cálculo matemático según la operación seleccionada
     */
    calcular() {
        let resultado

        /** si no hay un valor actual y se invoco calcular pasa ultimaAccion a "" (para evitar que se recetee la operacion)
        * esto pasa al concatenar operaciones ( 7 * 7 - = ) se ingresa una operacion y seguido se preciona igual con esto se evita
        * realizar el calculo y fuerza al usuario a ingresar un valor para continuar
        */
        if (this.valorActual == ""){
            // se pasa la ultimaAccion a "" por que al precionar el boton igual esta propiedad viene con el valor de (=)
            // pero como this.valorActual esta vacio no se puede ejecutar el calculo por eso cambia la propiedad y sale del metodo
            this.ultimaAccion = ""
            return
        }

        // Convierte los valores de string a números de punto flotante
        const valor_1 = parseFloat(this.valorPrevio)
        const valor_2 = parseFloat(this.valorActual)
        // Si algún valor no es un número válido, salir de la función
        // agrega la validacion que operacion sea diferente a '%' por que esta puede ejecutarse con un solo valor
        if ((isNaN(valor_1) || isNaN(valor_2)) && this.operacion !== '%') return
        
        // Realiza el cálculo según el tipo de operación
        switch (this.operacion) {
            case '+':
                resultado = valor_1 + valor_2
                break
            case '-':
                resultado = valor_1 - valor_2
                break
            case 'x':
                resultado = valor_1 * valor_2
                break
            case '÷':
                if (valor_2 === 0){
                    resultado = "Math Error"
                } else {
                    resultado = valor_1 / valor_2
                }
                break
            case '%':
                if (isNaN(valor_1)){
                    resultado = (valor_2 / 100) // si solo se esta evaluando un valor
                } else {
                    resultado = valor_1 * (valor_2 / 100)
                }
                break
            default:
                return
        }
        
        // Guarda el resultado como el valor actual
        this.valorActual = resultado
        // Limpia la operación y el valor previo
        this.operacion = undefined
        this.valorPrevio = ''
    }

    /**
     * Formatea un número para mostrarlo en pantalla con separadores de miles
     * @param {number} numero - El número a formatear
     * @returns {string} - El número formateado como string
     */
    obtenerNumero(numero) {
        const cadena = numero.toString()
        // Separa la parte entera de la decimal
        const enteros = parseFloat(cadena.split('.')[0])
        const decimales = cadena.split('.')[1]
        let mostrarEnteros
        
        // Si la parte entera no es un número válido, mostrar vacío
        if (isNaN(enteros)) {
            mostrarEnteros = ''
        } else {
            // Formatea los enteros con separadores de miles
            mostrarEnteros = enteros.toLocaleString('en', { maximumFractionDigits: 0 })
        }

        // Si hay decimales, los agrega al número formateado
        if (decimales != null) {
            return `${mostrarEnteros}.${decimales}`
        } else {
            return mostrarEnteros
        }
    }

    // TODO: buscar mejores opciones para formatear el resultado
    formatearResultado(){
        const resultado = this.obtenerNumero(this.valorActual)

        // comvierte el valor a numero
        const num = parseFloat(this.valorActual)
        
        // si no es numero retorna el valor actual (strign de error division por 0)
        if (isNaN(num)) return this.valorActual

        if (resultado.length >= this.limiteDigitos){
            const left = resultado.slice(0, 8)
            const right = resultado.slice(9, resultado.length)
            let resultadoFormateado = `${left}e+${right.length}`

            return resultadoFormateado
        }

        return resultado
    }

    /**
     * Actualiza la pantalla de la calculadora con los valores actuales
     */
    actualizarPantalla() {
        /**  cuando la ultima accion es producto de precionar el boton igual o es (%) muestra la operacion completa en el display superior
        * la comprobacion la hago sobre ultimaAccion por que en calcular this.operacion pasa a undefined 
        * y al precionar % invoco de una vez calcular() */
        if (this.ultimaAccion === "=" || this.ultimaAccion === "%"){
            // Muestra el valor actual formateado en el display principal
            this.valorActualTextElement.innerText = this.formatearResultado()
            // muestra la operacion completa en el display superior
            this.valorPrevioTextElement.innerText = this.opeacionCompleta
            return
        }
           
        // Muestra el valor actual formateado en el display principal
        this.valorActualTextElement.innerText = this.obtenerNumero(this.valorActual)

        // Si hay una operación seleccionada, muestra el valor previo y la operación
        if (this.operacion != null) {
            this.valorPrevioTextElement.innerText = `${this.obtenerNumero(this.valorPrevio)} ${this.operacion}`
        } else {
            this.valorPrevioTextElement.innerText = ''
        }
    }
}

/*
 * SECCIÓN DE INICIALIZACIÓN Y CONFIGURACIÓN DEL DOM
 * Esta sección maneja la captura de elementos DOM y la configuración inicial
 */

// Captura de elementos de botones numéricos (0-9 y punto decimal)
const numeroButtons = document.querySelectorAll('[data-numero]')
// Captura de elementos de botones de operaciones (+, -, x, ÷)
const operacionButtons = document.querySelectorAll('[data-operacion]')
// Captura del botón igual (=) para ejecutar cálculos
const igualButton = document.querySelector('[data-igual]')
// Captura del botón de porcentaje (%) - funcionalidad pendiente
const porcentajeButton = document.querySelector('[data-porcentaje]')
// Captura del botón para borrar último dígito (backspace)
const borrarButton = document.querySelector('[data-borrar]')
// Captura del botón para limpiar toda la calculadora (clear)
const borrarTodoButton = document.querySelector('[data-borrar-todo]')
// Captura del elemento que muestra el valor previo/operación en pantalla
const valorPrevioTextElement = document.querySelector('[data-valor-previo]')
// Captura del elemento que muestra el valor actual en pantalla
const valorActualTextElement = document.querySelector('[data-valor-actual]')

// Instancia principal de la calculadora con referencias a los elementos de display
const calculator = new Calculadora(valorPrevioTextElement, valorActualTextElement)

/*
 * CONFIGURACIÓN DE EVENT LISTENERS
 * Esta sección asigna eventos de click a cada tipo de botón
 */

// Asigna evento click a cada botón numérico
// Cuando se presiona un botón numérico, agrega ese número al valor actual y actualiza la pantalla
numeroButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.agregarNumero(button.innerText)
        calculator.actualizarPantalla()
    })
})

// Asigna evento click a cada botón de operación
// Cuando se presiona una operación (+, -, x, ÷), selecciona esa operación y actualiza la pantalla
operacionButtons.forEach(button => {
    button.addEventListener('click', () => {
        calculator.elejirOperacion(button.innerText)
        calculator.actualizarPantalla()
    })
})

// Evento para el boton de porcentaje (%)
porcentajeButton.addEventListener('click', (e) => {
    calculator.elejirOperacion(e.target.innerText)
    calculator.actualizarPantalla();
})

// Evento para el botón igual (=)
// Ejecuta el cálculo de la operación pendiente y muestra el resultado
igualButton.addEventListener('click', _button => {
    calculator.setIgual() // llama primero a la funcion setIgual para indicar que la ultimaAccion fue =
    calculator.calcular()
    calculator.actualizarPantalla()
})

// Evento para el botón de borrar todo (AC/Clear)
// Limpia completamente la calculadora y vuelve al estado inicial
borrarTodoButton.addEventListener('click', _button => {
    calculator.borrarTodo()
    calculator.actualizarPantalla()
})

// Evento para el botón de borrar (DEL/Backspace)
// Elimina el último dígito ingresado del valor actual
borrarButton.addEventListener('click', _button => {
    calculator.borrar()
    calculator.actualizarPantalla()
})

/*Laboratorio:
1. Arreglar bug que limite los numeros en pantalla
2. Funcionabilidad de boton de porcentaje
3. Si lo que se presiona despues de igual es un numero entonces que borre el resultado anterior e inicie una nueva operacion
4. Muestre la operacion completa en el display superior
*/