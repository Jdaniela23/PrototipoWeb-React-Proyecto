import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDFPedido = async (pedido, detallePedidos) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    const colorPrimario = [200, 155, 60];
    const colorSecundario = [51, 51, 51];
    const colorTexto = [80, 80, 80];

    // ENCABEZADO
    doc.setFillColor(...colorPrimario);
    doc.rect(0, 0, pageWidth, 45, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURA DE PEDIDO', pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(12);
    doc.text(`No. ${pedido.id_Pedido}`, pageWidth / 2, 30, { align: 'center' });

    const estado = pedido.estado_Pedido || 'Pendiente';
    let colorEstado = [255, 193, 7];

    if (['Completado', 'Entregado'].includes(estado)) colorEstado = [40, 167, 69];
    if (['Anulado', 'Cancelado'].includes(estado)) colorEstado = [220, 53, 69];

    doc.setFillColor(...colorEstado);
    doc.roundedRect(pageWidth / 2 - 20, 34, 40, 8, 2, 2, 'F');
    doc.text(estado.toUpperCase(), pageWidth / 2, 39.5, { align: 'center' });

    // INFORMACION CLIENTE
    let yPos = 55;
    doc.setTextColor(...colorSecundario);
    doc.setFontSize(14);
    doc.text('INFORMACIÓN DEL CLIENTE', 14, yPos);

    yPos += 16;
    const usuario = pedido.usuario || {};

    doc.setFontSize(10);
    doc.setTextColor(...colorTexto);

    doc.text(`Nombre: ${usuario.nombre_Completo ?? 'N/A'}`, 14, yPos);
    yPos += 6;

    doc.text(`Teléfono: ${usuario.numeroContacto ?? 'N/A'}`, 14, yPos);

    // INFO PEDIDO
    yPos += 14;
    doc.setFontSize(14);
    doc.setTextColor(...colorSecundario);
    doc.text('INFORMACIÓN DEL PEDIDO', 14, yPos);

    yPos += 14;
    doc.setFontSize(10);
    doc.setTextColor(...colorTexto);

    const formatFecha = f =>
      f ? new Date(f).toLocaleDateString('es-CO') : 'N/A';

    doc.text(`Fecha de Creación: ${formatFecha(pedido.fecha_Creacion)}`, 14, yPos);
    yPos += 6;

    doc.text(`Método de pago: ${pedido.metodo_Pago ?? 'N/A'}`, 14, yPos);
    yPos += 6;

    doc.text(`Domicilio: ${pedido.domicilio ? 'Sí' : 'No'}`, 14, yPos);
    yPos += 6;

    if (pedido.domicilio) {
      doc.text(`Dirección: ${pedido.direccion_Entrega ?? 'N/A'}`, 14, yPos);
      yPos += 6;
      doc.text(`Barrio: ${pedido.barrio_Entrega ?? 'N/A'}`, 14, yPos);
      yPos += 6;
    }

    // PRODUCTOS
    yPos += 14;
    doc.setFontSize(14);
    doc.setTextColor(...colorSecundario);
    doc.text('PRODUCTOS', 14, yPos);

    yPos += 10;

    // Mapea productos seguros
    const productosData =
      detallePedidos?.length > 0
        ? detallePedidos.map((d, index) => {
            const dp = d.detalleProducto || {};
            const prod = dp.producto || {};
            const talla = dp.talla || {};
            const color = dp.color || {};

            const cantidad = d.cantidad_Detalle_Pedido || d.cantidad || 1;
            const subtotal = d.precioTotal_Detalle_Pedido ?? d.subtotal ?? 0;
            const precioUnit = subtotal / (cantidad || 1);

            return [
              index + 1,
              prod.nombre_Producto ?? 'Producto sin nombre',
              `${talla.nombre_Talla ?? 'N/A'} - ${color.nombre_Color ?? 'N/A'}`,
              cantidad,
              `$${precioUnit.toLocaleString('es-CO')}`,
              `$${subtotal.toLocaleString('es-CO')}`
            ];
          })
        : [['', 'No hay productos registrados', '', '', '', '']];

    autoTable(doc, {
      startY: yPos,
      head: [['#', 'Producto', 'Talla y Color', 'Cantidad', 'Precio Unit.', 'Subtotal']],
      body: productosData,
      theme: 'striped',
      headStyles: {
        fillColor: colorPrimario,
        textColor: [255, 255, 255]
      },
      margin: { left: 14, right: 14 }
    });

    // FINAL Y
    const finalY = doc.lastAutoTable?.finalY ?? yPos + 10;

    // TOTAL
    const total = pedido.total_Pedido ?? 0;

    doc.setFillColor(245, 245, 245);
    doc.roundedRect(pageWidth - 80, finalY + 10, 66, 20, 2, 2, 'F');

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colorPrimario);

    doc.text('TOTAL:', pageWidth - 75, finalY + 22);
    doc.text(`$${total.toLocaleString('es-CO')}`, pageWidth - 20, finalY + 22, {
      align: 'right'
    });

    doc.save(`Factura_Pedido_${pedido.id_Pedido}.pdf`);
    return true;
  } catch (error) {
    console.error('ERROR GENERANDO PDF:', error);
    return false;
  }
};
