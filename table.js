var delta = 0;
var eps = 10;
var isUp = false;

function AddRow(top, height)
{
  if (top == undefined)
  {
    top = 'название вершины';
  }
  if (height == undefined)
  {
    height = '0';
  }
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
  try
   {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e)
 {
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

function Draw()
{
  if (240 + delta > 450)
  {
    isUp = true;
  }
  else if (20 + delta < 0)
  {
    isUp = false;
  }
  if (isUp)
  {
    delta = delta - eps;
  }
  else
  {
    delta = delta + eps;
  }
  var canvas = document.getElementById("example");
  canvas.height=450;
  canvas.width=450;
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = "orange";
	ctx.fillRect(0, 40 + delta, 20, 200);
  ctx.fillRect(0, 20 + delta, 100, 20);
  ctx.fillRect(80, 40 + delta, 20, 200);
  ctx.fillStyle = "green";
  ctx.fillRect(120, 40+ delta, 20, 200);
  ctx.fillRect(120, 20+ delta, 80, 20);
  ctx.fillRect(120, 120+ delta, 80, 20);
  ctx.fillRect(120, 220+ delta, 80, 20);
  ctx.fillStyle = "brown";
  ctx.fillRect(220, 40+ delta, 20, 200);
  ctx.fillRect(220, 20+ delta, 80, 20);
  ctx.fillRect(280, 20+ delta, 20, 100);
  ctx.fillRect(220, 120+ delta, 120, 20);
  ctx.fillRect(320, 120+ delta, 20, 100);
  ctx.fillRect(220, 220+ delta, 120, 20);
  setTimeout("Draw()", 20);
}

$(function() {
    $('#click-elem').click(function()
    {
        $('#overlay').fadeIn('fast',function()
        {
            $('#nonebox').animate({'top':'160px'},500);
        });
    });
    $('#box-close').click(function(){
        $('#nonebox').animate({'top':'-1000px'},500,function(){
            $('#overlay').fadeOut('fast');
        });
    });
});
