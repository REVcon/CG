function AddRow(top, height)
{
  var table = document.getElementById('mainTable').getElementsByTagName('tbody')[0];
  var tr = document.createElement('tr');
  tr.innerHTML = '<td contenteditable = "true">' + top + '</td>\n\
                <td contenteditable = "true">' + height + '</td>';
  table.appendChild(tr);
}

function TableToJson()
{
  var tableObj = {};
  var rowsArr = [];
  var table = document.getElementById('mainTable').getElementsByTagName('tbody')[0];
  var rows = table.getElementsByTagName('tr');
  for (var i = 0; i < rows.length; i++)
  {
    var cells = rows[i].getElementsByTagName('td');
    var cell = {};
    cell['top'] = cells[0].innerHTML;
    cell['height'] = cells[1].innerHTML;
    rowsArr.push(cell);
  }
  tableObj['table'] = rowsArr;
  return JSON.stringify(tableObj);
}

function ShowJSON()
{
  alert(TableToJson());
}

function IsStorageSupported()
{
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
} catch (e) {
    return false;
  }
}

function SaveTable()
{
  if (IsStorageSupported())
  {
    var data = TableToJson();
    localStorage.setItem('myTable', data);
  }
}

function BuildTable()
{
  if (IsStorageSupported())
  {
    var tableAsStr = localStorage.getItem('myTable');
    if (tableAsStr != null)
    {
      var tableObj = JSON.parse(tableAsStr);
      var cellsArr = tableObj['table'];
      for (var i = 0; i < cellsArr.length; ++i)
      {
        var top = cellsArr[i]['top'];
        var height = cellsArr[i]['height'];
        AddRow(top, height);
      }
    }
  }
}
