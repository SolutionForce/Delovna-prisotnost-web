import { Attendance, User } from "../../interfaces/user";

export default function pdfMultipleUsersReportTemplate(users: User[]): string {
    const generateTable = (attendances: Attendance[]) => {
      let tableHtml = '<table class="tableEnd">';
      tableHtml += '<tr><th colspan="4">Attendance records</th></tr><tr><th>Entry</th><th>Time in</th><th>Time out</th><th>Breaks</th></tr>';

      if(attendances.length === 0)
        tableHtml += `<tr><td colspan="4" class="centerText">No data</td></tr>`;
  
      for (let i = 0; i < attendances.length; i++) {
        tableHtml += `<tr>`;
        tableHtml += `<td>${i + 1}</td>`;
        tableHtml += `<td>${new Date(attendances[i].timeIn.seconds * 1000 + attendances[i].timeIn.nanoseconds / 1e6).toLocaleString()}</td>`;
        tableHtml += `<td>${attendances[i].timeOut ? new Date(attendances[i].timeOut!.seconds * 1000 + attendances[i].timeOut!.nanoseconds / 1e6).toLocaleString() : 'Ongoing'}</td>`;
  
        tableHtml += `<td><table><tr><th>Entry</th><th>Start</th><th>End</th><th>Description</th></tr>`;
        if(attendances[i].breaks.length === 0)
            tableHtml += `<tr><td colspan="4" class="centerText">No breaks</td></tr>`;

        for (let j = 0; j < attendances[i].breaks.length; j++) {
          const breakData = attendances[i].breaks[j];
          tableHtml += `<tr>`;
          tableHtml += `<td>${j + 1}</td>`;
          tableHtml += `<td>${new Date(breakData.start.seconds * 1000 + breakData.start.nanoseconds / 1e6).toLocaleString()}</td>`;
          tableHtml += `<td>${breakData.end ? new Date(breakData.end.seconds * 1000 + breakData.end.nanoseconds / 1e6).toLocaleString() : 'Ongoing'}</td>`;
          tableHtml += `<td class="break-description">${breakData.description}</td>`;
          tableHtml += `</tr>`;
        }
        tableHtml += `</table></td>`;
  
        tableHtml += `</tr>`;
      }
  
      tableHtml += '</table>';
      return tableHtml;
    };
  
    const generateUserHtml = (user: User) => {
      return `
        <table>
            <tr><th colspan="3">User information</th></tr>
            <tr><th>Name</th><td>${user.name}</td></tr>
            <tr><th>Surname</th><td>${user.surname}</td></tr>
            <tr><th>Email</th><td>${user.email}</td></tr>
        </table>
        ${generateTable(user.attendance)}
      `;
    };
  
    let allUsersHtml = '';
    for (const user of users) {
      allUsersHtml += generateUserHtml(user);
    }
  
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>User Attendance</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
              }
  
              table {
                  width: 100%;
                  border-collapse: collapse;
              }

              .tableEnd {
                margin-bottom: 60px;
              }

              .centerText {
                text-align: center;
              }
  
              th, td {
                  border: 1px solid #dddddd;
                  text-align: left;
                  padding: 8px;
              }
  
              th {
                  background-color: #f2f2f2;
              }
  
              .break-description {
                  max-width: 200px; /* Adjust the max-width based on your design */
                  word-wrap: break-word;
                  overflow: hidden;
                  text-overflow: ellipsis;
              }
              
              h2 {
                  margin: 1em;
                  margin-left: 0;
              }
          </style>
      </head>
      <body>
          ${allUsersHtml}
      </body>
      </html>
    `;
  }
  