import tkinter as tk
from tkinter import messagebox

inventario = {}  

ventana = tk.Tk()
ventana.title("Sistema de Gestión de Inventario")
ventana.geometry("450x520")

titulo = tk.Label(ventana, text="SISTEMA DE GESTION DE INVENTARIO",
                  font=("Arial", 14, "bold"))
titulo.pack(pady=10)



def agregar_producto():
    win = tk.Toplevel()
    win.title("Agregar producto")
    win.geometry("300x250")

    tk.Label(win, text="Nombre del producto:").pack()
    nombre_entry = tk.Entry(win)
    nombre_entry.pack()

    tk.Label(win, text="Cantidad:").pack()
    cantidad_entry = tk.Entry(win)
    cantidad_entry.pack()

    tk.Label(win, text="Precio:").pack()
    precio_entry = tk.Entry(win)
    precio_entry.pack()

    def guardar():
        nombre = nombre_entry.get()
        if nombre in inventario:
            messagebox.showwarning("Aviso", "Ese producto ya existe. Usa la opcion Actualizar.")
            return

        try:
            cantidad = int(cantidad_entry.get())
            precio = float(precio_entry.get())
        except:
            messagebox.showerror("Error", "ERROR: ingrese valores numericos validos.")
            return

        inventario[nombre] = {"cantidad": cantidad, "precio": precio, "ventas": 0}
        messagebox.showinfo("OK", f"producto '{nombre}' agregado correctamente.")
        win.destroy()

    tk.Button(win, text="Guardar", command=guardar).pack(pady=10)


def eliminar_producto():
    win = tk.Toplevel()
    win.title("Eliminar producto")
    win.geometry("300x200")

    tk.Label(win, text="Nombre del producto que desea Eliminar:").pack()
    nombre_entry = tk.Entry(win)
    nombre_entry.pack()

    def eliminar():
        nombre = nombre_entry.get()
        if nombre in inventario:
            del inventario[nombre]
            messagebox.showinfo("OK", f"producto '{nombre}' Eliminado.")
            win.destroy()
        else:
            messagebox.showerror("Error", "El producto no existe en el inventario")

    tk.Button(win, text="Eliminar", command=eliminar).pack(pady=10)


def actualizar_producto():
    win = tk.Toplevel()
    win.title("Actualizar producto")
    win.geometry("300x250")

    tk.Label(win, text="Nombre del producto que se desea actualizar:").pack()
    nombre_entry = tk.Entry(win)
    nombre_entry.pack()

    tk.Label(win, text="Nueva cantidad:").pack()
    cantidad_entry = tk.Entry(win)
    cantidad_entry.pack()

    tk.Label(win, text="Nuevo precio:").pack()
    precio_entry = tk.Entry(win)
    precio_entry.pack()

    def actualizar():
        nombre = nombre_entry.get()

        if nombre not in inventario:
            messagebox.showerror("Error", "El Producto no se encontro.")
            return

        try:
            cantidad = int(cantidad_entry.get())
            precio = float(precio_entry.get())
        except:
            messagebox.showerror("Error", "ERROR: ingresa el valor valido.")
            return

        inventario[nombre]["cantidad"] = cantidad
        inventario[nombre]["precio"] = precio
        messagebox.showinfo("OK", "Producto actualizado correctamente.")
        win.destroy()

    tk.Button(win, text="Actualizar", command=actualizar).pack(pady=10)


def registrar_venta():
    win = tk.Toplevel()
    win.title("Registrar venta")
    win.geometry("300x250")

    tk.Label(win, text="Producto vendido:").pack()
    nombre_entry = tk.Entry(win)
    nombre_entry.pack()

    tk.Label(win, text="Cantidad vendida:").pack()
    cantidad_entry = tk.Entry(win)
    cantidad_entry.pack()

    def vender():
        nombre = nombre_entry.get()
        if nombre not in inventario:
            messagebox.showerror("Error", "El producto no existe.")
            return

        try:
            cv = int(cantidad_entry.get())
        except:
            messagebox.showerror("Error", "Cantidad invalida.")
            return

        if cv <= inventario[nombre]["cantidad"]:
            inventario[nombre]["cantidad"] -= cv
            inventario[nombre]["ventas"] += cv
            messagebox.showinfo("OK", "Venta registrada correctamente.")
            win.destroy()
        else:
            messagebox.showerror("Error", "No hay suficiente stock.")

    tk.Button(win, text="Registrar", command=vender).pack(pady=10)


def mostrar_inventario():
    win = tk.Toplevel()
    win.title("Inventario Actual")
    win.geometry("350x400")

    if not inventario:
        tk.Label(win, text="Todavia no hay productos registrados en el inventario.").pack()
        return

    tk.Label(win, text="Productos registrados").pack()

    for nombre, info in inventario.items():
        tk.Label(win, text="------------------------------------------").pack()
        tk.Label(win, text=f"producto: {nombre}").pack()
        tk.Label(win, text=f"cantidad disponible: {info['cantidad']}").pack()
        tk.Label(win, text=f"precio unitario: $ {info['precio']}").pack()
        tk.Label(win, text=f"Unidades vendidas: {info['ventas']}").pack()

    tk.Label(win, text="------------------------------------------").pack()
    tk.Label(win, text="Eso es todo lo que hay en el inventario por el momento").pack()


def reporte_ventas():
    win = tk.Toplevel()
    win.title("Reporte de inventario")
    win.geometry("350x400")

    if not inventario:
        tk.Label(win, text="No hay Productos en el inventario, no se puede generar el reporte").pack()
        return

    total_general = 0

    tk.Label(win, text="Detalles de las ventas:").pack()
    tk.Label(win, text="------------------------------------------").pack()

    for nombre, datos in inventario.items():
        cantidad_vendida = datos["ventas"]
        precio_unitario = datos["precio"]
        total_producto = cantidad_vendida * precio_unitario
        total_general += total_producto

        tk.Label(win, text=f"producto: {nombre}").pack()
        tk.Label(win, text=f"Unidades vendidas: {cantidad_vendida}").pack()
        tk.Label(win, text=f"Total generado: ${total_producto}").pack()
        tk.Label(win, text="").pack()

    tk.Label(win, text="------------------------------------------").pack()
    tk.Label(win, text=f"Monto total vendido en el dia: $ {total_general}").pack()
    tk.Label(win, text="Fin del reporte.").pack()


# ==========================================================
# BOTONES DEL MENÚ (igual que tus opciones 1–7)
# ==========================================================

tk.Button(ventana, text="1. Agregar producto", width=40, command=agregar_producto).pack(pady=5)
tk.Button(ventana, text="2. Eliminar producto", width=40, command=eliminar_producto).pack(pady=5)
tk.Button(ventana, text="3. Actualizar producto", width=40, command=actualizar_producto).pack(pady=5)
tk.Button(ventana, text="4. Registrar venta", width=40, command=registrar_venta).pack(pady=5)
tk.Button(ventana, text="5. Mostrar inventario", width=40, command=mostrar_inventario).pack(pady=5)
tk.Button(ventana, text="6. Generar reporte de ventas", width=40, command=reporte_ventas).pack(pady=5)
tk.Button(ventana, text="7. Salir", width=40, command=ventana.destroy).pack(pady=10)

ventana.mainloop()