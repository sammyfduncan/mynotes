Okay, here are well-rounded, informative study notes based on the provided lecture slides.

**SCC.111 Software Development – Lecture 4: Functions & Flow**

**I. Overview**

*   This lecture focuses on expanding our understanding of code flow by introducing functions.  Specifically, it covers:
    *   How code flows.
    *   How to and when to declare our own functions.
    *   How data flows through functions (parameter passing).
    *   How function calls change program flow.

**II. Code Flow: From Statements to Programs**

*   Code flow occurs at different scales:
    *   **Between Programs:** (Covered in later courses)
    *   **Between Blocks of Code:** The focus of this lecture (Functions).
    *   **Between Statements:** Covered in the previous lecture.
    *   **Within Expressions:** Covered in the previous lecture.

**III. Problem Decomposition and Functions**

*   **Problem Decomposition:** We solve complex problems by breaking them down into a series of smaller, more manageable steps.  This process is often iterative (iterative refinement).
*   **Functions Package Code:** It makes sense to package sets of statements into functional units to:
    *   Encapsulate specific functionality.
    *   Avoid repeating blocks of statements.
    *   Make code easier to maintain and reuse (write less code, fewer places to change).

**IV. Functions in C**

*   Most programming languages provide support for creating functions.
*   **C allows us to:**
    *   Define functions that package and name specific functionality.
    *   Use libraries – sets of pre-compiled functions (defined by header files like `stdio.h`).
    *   (Later) Bundle our own functions to create libraries.

**V. C Function Structure**

*   **General Form:**

    ```c
    return_type function_name(parameter_type parameter_name, ...) {
        /* Function body: some lines of code */
        return value; // If return_type is not void
    }
    ```

    *   `return_type`:  The data type of the value returned by the function.
        *   Must be a simple *arithmetic type* (e.g., `int`, `float`, `char`).
        *   Can be `void` if the function does not return a value.
    *   `function_name`:  The name of the function (used to call it).
    *   `parameter-type-list`: A list of parameters, including their types, that the function accepts.
        *   Can be empty if the function takes no parameters.
    *   `compound-statement`:  The function body (enclosed in `{}`), containing the code to be executed when the function is called.

**VI. Code Examples: Beep!**

*Example:*
```c
#include <stdio.h>

void beep(int howManyTimes) {
    for (int beeps = 0; beeps < howManyTimes; beeps++) {
        printf("Beep!\n");
        sleep(1);
    }
}

int main() {
    beep(5);
    return 0;
}
```

**VII. `main()` Function**

*   The `main()` function is the entry point of a C program.
*   It takes no parameters. It returns a code to the shell.
*   Strictly, `main` is: `int main(int argc, char *argv[])`
    *   `argc` and `argv` are related to command line arguments.

**VIII. Function Declaration**

*   You must *declare* a function before you *call* it in your code.
* The compiler needs to 'see' a function declaration before it is called, this is done by placing the function defintion before the main function where it is called.
*   The compiler will 'see' beep's declaration and can then 'call' it from within main

**IX. Code Flow with Functions**

1.  Execution starts in `main()`.
2.  When `beep(5);` is encountered, the program jumps to the `beep()` function.
3.  The code inside the `beep()` function is executed.
4.  Once `beep()` finishes, execution returns to the next line in `main()` after the function call.

**X. Data Flow and Parameter Passing**

*   Data can be passed *into* functions through parameters.
*   Example:

```c
int main() {
    printf("Hello, world\n"); //"Hello, world\n" is data 'passed' into printf
}
```
*   In the beep example, `howManyTimes` in `void beep(int howManyTimes)` becomes a variable within the `beep()` function, and the value passed (e.g., `5` in `beep(5);`) is assigned to this variable.

**XI. Return Values**

*   Functions can also return values back to the calling code.
*Example:*

```c
int move_forward(int howManyTimes) {
    while (howManyTimes > 0 && sense_obstacle() == 0) {
        motor_on();
        sleep(1);
        motor_off();
        howManyTimes--;
    }
    return howManyTimes == 0; // return TRUE if hit anything
}

int main() {
    if (move_forward(5))
        printf("Success!\n");
    else
        printf("Oh no!\n");
    return 0;
}
```

*   The function `move_forward` effectively 'evaluates' to the returned result (e.g., `TRUE` or `FALSE`), which is then used in the `if` statement.

**XII. Function Declarations and Type Matching**

*   A function declaration is like a 'socket' with a precise specification. You can only 'plug' into (call) it if your arguments match.

**XIII. Formal vs. Actual Parameters**

*   **Formal Parameters:** Declared in the function definition, specifying the type and name of each expected input.
*   **Actual Parameters:** The values passed to the function when it is called.
*   **Important:** The actual parameters must match the formal parameters in *both* type and position!

```c
float buy_coffees (int howMany, float cost) { ... } //Declaration

float totalCost = buy_coffees(10, 4.50); // Call
```

**XIV. Pass by Value**

*   In C, parameters are passed *by value*. This means that the function receives a *copy* of the actual parameter's value, not the original variable itself.
*   Even if the formal and actual parameters have the same name, they are different variables residing in *different scopes*.

**XV. Summary**

*   **Key Concepts:**
    *   Creating reusable sub-units of code called functions.
    *   Programs flow into and out of functions.
    *   Information (variables) is passed into and out of functions.

These notes provide a comprehensive overview of the lecture, covering the key concepts related to functions and flow in C. Remember to supplement these notes with the actual code examples and practice exercises.
