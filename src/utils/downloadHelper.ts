export const downloadVoucher = (
  type: 'deposito' | 'retiro' | 'transferencia',
  data: {
    amount: number;
    accountName: string;
    referenceId: string | number;
    date: string;
    destinationName?: string;
    destinationBank?: string;
    destinationAccount?: string;
    reason?: string;
  }
) => {
  const opTitle = type === 'deposito' ? 'Depósito' : type === 'retiro' ? 'Retiro' : 'Transferencia';
  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Comprobante de ${opTitle}</title>
    <style>
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #f3f4f6;
            margin: 0;
            padding: 40px 20px;
            display: flex;
            justify-content: center;
        }
        .ticket-card {
            background-color: #ffffff;
            border-radius: 16px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
            border: 1px solid #e5e7eb;
            width: 100%;
            max-width: 450px;
            overflow: hidden;
        }
        .header {
            background: linear-gradient(135deg, #A80035, #7E0028);
            color: #ffffff;
            padding: 32px 24px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.025em;
        }
        .header p {
            margin: 8px 0 0 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .badge {
            background-color: #10b981;
            color: white;
            padding: 6px 12px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: inline-block;
            margin-top: 12px;
        }
        .amount-section {
            padding: 32px 24px;
            text-align: center;
            border-bottom: 1px dashed #e5e7eb;
        }
        .amount-label {
            font-size: 12px;
            color: #6b7280;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .amount-value {
            font-size: 36px;
            font-weight: 800;
            color: #111827;
            margin-top: 8px;
        }
        .details-section {
            padding: 24px;
            background-color: #fafafa;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 16px;
            font-size: 14px;
        }
        .detail-row:last-child {
            margin-bottom: 0;
        }
        .label {
            color: #6b7280;
            font-weight: 500;
        }
        .value {
            color: #111827;
            font-weight: 700;
            text-align: right;
        }
        .footer {
            padding: 24px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
            border-top: 1px solid #f3f4f6;
        }
    </style>
</head>
<body>
    <div class="ticket-card">
        <div class="header">
            <h1>CrimsonBank</h1>
            <p>Comprobante de Operación Bancaria</p>
            <div class="badge">PROCESADO</div>
        </div>
        <div class="amount-section">
            <div class="amount-label">Monto de la Operación</div>
            <div class="amount-value">S/ ${data.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</div>
        </div>
        <div class="details-section">
            <div class="detail-row">
                <span class="label">Operación:</span>
                <span class="value">${opTitle}</span>
            </div>
            <div class="detail-row">
                <span class="label">Referencia:</span>
                <span class="value">${data.referenceId}</span>
            </div>
            <div class="detail-row">
                <span class="label">Fecha y Hora:</span>
                <span class="value">${data.date}</span>
            </div>
            <div class="detail-row">
                <span class="label">Cuenta de Origen:</span>
                <span class="value">${data.accountName}</span>
            </div>
            ${data.destinationName ? `
            <div class="detail-row">
                <span class="label">Destinatario:</span>
                <span class="value">${data.destinationName}</span>
            </div>
            ` : ''}
            ${data.destinationBank ? `
            <div class="detail-row">
                <span class="label">Banco Destino:</span>
                <span class="value">${data.destinationBank}</span>
            </div>
            ` : ''}
            ${data.destinationAccount ? `
            <div class="detail-row">
                <span class="label">Cuenta Destino:</span>
                <span class="value">${data.destinationAccount}</span>
            </div>
            ` : ''}
            ${data.reason ? `
            <div class="detail-row">
                <span class="label">Motivo:</span>
                <span class="value">${data.reason}</span>
            </div>
            ` : ''}
        </div>
        <div class="footer">
            <p>Operación protegida por Crimson Guard® Encryption v.2.6</p>
            <p>Este es un documento oficial descargado de CrimsonBank.</p>
        </div>
    </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `comprobante-${type}-${data.referenceId}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadAccountStatement = (
  account: {
    userName: string;
    accountNumber: string;
    accountType: 'corriente' | 'ahorros';
    balance: number;
    id: string;
    createdAt: string;
  },
  allTransactions: any[]
) => {
  const accountTransactions = allTransactions
    .filter((tx) => tx.accountId === account.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const accountTitle = account.accountType === 'ahorros' ? 'Cuenta de Ahorros' : 'Cuenta Corriente';
  
  let totalIncomes = 0;
  let totalExpenses = 0;
  accountTransactions.forEach(tx => {
    if (tx.amount > 0) {
      totalIncomes += tx.amount;
    } else {
      totalExpenses += Math.abs(tx.amount);
    }
  });

  const transactionRows = accountTransactions.map(tx => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; font-family: monospace;">${tx.date}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px;">
        <div><strong>${tx.description}</strong></div>
        <div style="font-size: 11px; color: #6b7280;">ID: ${tx.id}</div>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; color: #6b7280; text-transform: uppercase;">${tx.category}</td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; font-size: 13px; font-weight: 700; text-align: right; color: ${tx.amount > 0 ? '#10b981' : '#111827'}">
        ${tx.amount > 0 ? '+' : ''}S/ ${tx.amount.toLocaleString('es-PE', { minimumFractionDigits: 2 })}
      </td>
    </tr>
  `).join('');

  const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Estado de Cuenta - ${accountTitle}</title>
    <style>
        body {
            font-family: 'Inter', system-ui, -apple-system, sans-serif;
            background-color: #f9fafb;
            margin: 0;
            padding: 40px;
            color: #111827;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 12px;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
            padding: 40px;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 2px solid #A80035;
            padding-bottom: 24px;
            margin-bottom: 32px;
        }
        .logo-section h1 {
            color: #A80035;
            margin: 0;
            font-size: 28px;
            font-weight: 800;
        }
        .logo-section p {
            margin: 4px 0 0 0;
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.1em;
        }
        .info-section {
            text-align: right;
            font-size: 14px;
            color: #4b5563;
        }
        .info-section h2 {
            margin: 0;
            font-size: 18px;
            color: #111827;
            font-weight: 700;
        }
        .info-section p {
            margin: 4px 0 0 0;
        }
        .details-grid {
            display: grid;
            grid-template-cols: 1fr 1fr;
            gap: 24px;
            margin-bottom: 32px;
        }
        .card {
            background-color: #f9fafb;
            border: 1px solid #f3f4f6;
            border-radius: 8px;
            padding: 20px;
        }
        .card h3 {
            margin: 0 0 12px 0;
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        .card p {
            margin: 0;
            font-size: 14px;
            font-weight: 700;
        }
        .balance-hero {
            background-color: #fdf2f4;
            border: 1px solid #fce7eb;
            color: #A80035;
        }
        .balance-hero h3 {
            color: #7e0028;
        }
        .balance-hero .amount {
            font-size: 28px;
            font-weight: 800;
        }
        .summary-stats {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            margin-bottom: 32px;
        }
        .stat-box {
            flex: 1;
            background-color: #fafafa;
            border: 1px solid #f3f4f6;
            border-radius: 8px;
            padding: 16px;
            text-align: center;
        }
        .stat-box h4 {
            margin: 0 0 4px 0;
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
        }
        .stat-box p {
            margin: 0;
            font-size: 16px;
            font-weight: 700;
        }
        .table-container {
            margin-top: 32px;
        }
        .table-container h3 {
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 16px;
            border-bottom: 1px solid #f3f4f6;
            padding-bottom: 8px;
        }
        table {
            width: 100%;
            border-collapse: collapse;
        }
        th {
            background-color: #fafafa;
            padding: 12px;
            text-align: left;
            font-size: 11px;
            color: #6b7280;
            text-transform: uppercase;
            border-bottom: 2px solid #e5e7eb;
        }
        .footer {
            margin-top: 48px;
            border-top: 1px solid #e5e7eb;
            padding-top: 24px;
            text-align: center;
            font-size: 11px;
            color: #9ca3af;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo-section">
                <h1>CrimsonBank</h1>
                <p>Banca Privada y Biométrica</p>
            </div>
            <div class="info-section">
                <h2>Estado de Cuenta</h2>
                <p>Periodo: Al ${new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            </div>
        </div>

        <div class="details-grid">
            <div class="card">
                <h3>Información del Cliente</h3>
                <p style="font-size: 16px; margin-bottom: 4px;">${account.userName}</p>
                <p style="font-weight: 500; color: #4b5563;">Crimson Platinum Member</p>
            </div>
            <div class="card balance-hero">
                <h3>Saldo Disponible</h3>
                <div class="amount">S/ ${account.balance.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 32px;">
            <h3>Detalles del Producto</h3>
            <div style="display: flex; justify-content: space-between; font-size: 14px;">
                <div><strong>Tipo:</strong> ${accountTitle}</div>
                <div><strong>Número de Cuenta:</strong> ${account.accountNumber}</div>
                <div><strong>Fecha de Creación:</strong> ${new Date(account.createdAt).toLocaleDateString('es-PE')}</div>
            </div>
        </div>

        <div class="summary-stats">
            <div class="stat-box">
                <h4>Total Depósitos (+)</h4>
                <p style="color: #10b981;">S/ ${totalIncomes.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
            </div>
            <div class="stat-box">
                <h4>Total Retiros / Gastos (-)</h4>
                <p style="color: #111827;">S/ ${totalExpenses.toLocaleString('es-PE', { minimumFractionDigits: 2 })}</p>
            </div>
            <div class="stat-box">
                <h4>Nro. Transacciones</h4>
                <p>${accountTransactions.length}</p>
            </div>
        </div>

        <div class="table-container">
            <h3>Movimientos Recientes</h3>
            ${accountTransactions.length > 0 ? `
            <table>
                <thead>
                    <tr>
                        <th style="width: 15%">Fecha</th>
                        <th style="width: 50%">Detalle</th>
                        <th style="width: 15%">Categoría</th>
                        <th style="width: 20%; text-align: right;">Monto</th>
                    </tr>
                </thead>
                <tbody>
                    ${transactionRows}
                </tbody>
            </table>
            ` : `
            <p style="text-align: center; color: #6b7280; padding: 24px; background-color: #fafafa; border-radius: 8px;">
                No se registran movimientos para este producto en el periodo seleccionado.
            </p>
            `}
        </div>

        <div class="footer">
            <p>Este documento es un reporte generado de forma segura mediante autenticación biométrica.</p>
            <p>CrimsonBank S.A. - Regulado por la Superintendencia de Banca, Seguros y AFP (SBS).</p>
        </div>
    </div>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `estado-de-cuenta-${account.accountNumber}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const downloadTransactionHistory = (transactions: any[]) => {
  const headers = ['ID', 'Fecha', 'Descripcion', 'Categoria', 'Estado', 'Monto'];
  const rows = transactions.map(tx => [
    tx.id,
    tx.date,
    tx.description.replace(/,/g, ' '),
    tx.category,
    tx.status,
    tx.amount
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `historial-transacciones.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
