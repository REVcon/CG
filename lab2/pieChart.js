var delta = 0;
var eps = 10;
var isUp = false;

var colors = [];
var darkColors = [];
var tableInfo = {};
var shiftAngle = 0;
var stepConst = 2;
var sumNumbersOfTable = 0;
var ctx;
var widthCanvas = 550;
var heightCanvas = 550;
var zeroPoint = 0;
var radiusX = 200;
var radiusY = 140;
var autoRotation = true;
var userRotation = false;
var prevX = 250;
var prevY = 210;
var curX = 0;
var curY = 0;
var inclineAngle = 45;
var choosenColor = undefined;
var lastColor = undefined;
var lightMode = false;
var innerRad = 30;

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

function GradToRadians(angleGrad)
{
	return Math.PI * -angleGrad / 180.0;
}

CanvasRenderingContext2D.prototype.DrawSector = function (x, y, radiusA, radiusB, angleFrom, angleTo)
{
  this.save();
  this.beginPath();
  this.translate(x, y);
  this.moveTo(0, 0);
  this.scale(radiusA / radiusB, 1);
  this.arc(0, 0, radiusB, angleFrom, angleTo, true);
  this.restore();
  this.closePath();
  this.fill();
}

CanvasRenderingContext2D.prototype.DrawLines = function (x, y, radiusA, radiusB, angleFrom, angleTo)
{
  this.save();
  this.beginPath();
  this.translate(x, y);
  this.moveTo(0, 0);
  this.scale(radiusA / radiusB, 1);
  this.arc(0, 0, radiusB, angleFrom, angleTo, true);
  this.restore();
  this.closePath();
  this.stroke();
}

function GetRandomColor()
{
  return '#' + Math.round((Math.random() * (999999 - 100000) + 100000));
}


function ColorLuminance(hex, lum)
 {
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
	}
	lum = lum || 0;
	var rgb = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i*2,2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		rgb += ("00"+c).substr(c.length);
	}
	return rgb;
}

function PieChart()
{
  sumNumbersOfTable = 0;
  darkColors.splice(0, darkColors.length);
  colors.splice(0, colors.length);
  tableInfo = GetInfoFromTable();
  var cellsArr = tableInfo['table'];
  for (var i = 0; i < cellsArr.length; ++i)
  {
    var height = cellsArr[i]['height'];
    sumNumbersOfTable += parseInt(height);
    var color = GetRandomColor();
    colors.push(color);
    darkColors.push(ColorLuminance(color, -0.5));
  }
  var canvas = document.getElementById("pieChart");
  canvas.height = heightCanvas;
  canvas.width = widthCanvas;
  ctx = canvas.getContext("2d");
  zeroPoint = Math.min(canvas.height/2, canvas.width/2);
  setInterval("Update()", 20);
}

function DrawPieChart()
{
  if (lastColor != undefined)
  {
    if (lastColor.toString() != choosenColor.toString())
    {
      HelpClear();
    }
  }
  else
  {
    HelpClear();
  }
  ctx.clearRect(0, 0, widthCanvas, heightCanvas);
  var cellsArr = tableInfo['table'];
  var radB = radiusX * Math.cos(GradToRadians(inclineAngle));
  var prevAngle = 0;
  var curAngle = 0;
  for (var j = 0; j < 40; ++j)
  {
    prevAngle = shiftAngle;
    curAngle = shiftAngle;
    for (var i = 0; i < cellsArr.length; ++i)
    {
      ctx.strokeStyle = darkColors[i];
      ctx.lineWidth = 2;
      curAngle = (curAngle + 360 *(parseInt(cellsArr[i]['height']) / sumNumbersOfTable)) % 360;
      if (choosenColor != undefined)
      {
        if ((colors[i].toString() == choosenColor.toString()) || (darkColors[i].toString() == choosenColor.toString())
        || (ColorLuminance(colors[i], 0.6).toString() == choosenColor.toString()) || (ColorLuminance(colors[i], 0.8).toString() == choosenColor.toString()) )
        {
          ctx.strokeStyle = ColorLuminance(colors[i], 0.6);
        }
      }
      var x = 0.0;
      var y = 0.0;
      var angle = 0.0;
      if (curAngle < prevAngle)
      {
        angle = ((360 - prevAngle + curAngle)/ 2 + prevAngle) % 360;
        x = innerRad * Math.cos(angle * Math.PI / 180);
        y = innerRad * Math.sin(angle * Math.PI / 180);
      }
      else
      {
        angle = ((curAngle - prevAngle) / 2 + prevAngle) % 360;
        x = innerRad * Math.cos(angle * Math.PI / 180);
        y = innerRad * Math.sin(angle * Math.PI / 180);
      }
      ctx.DrawLines(zeroPoint + x , zeroPoint - j - y, radiusX, radB, GradToRadians(prevAngle), GradToRadians(curAngle));
      prevAngle = curAngle;
    }
  }
  prevAngle = shiftAngle;
  curAngle = shiftAngle;
  for (var i = 0; i < cellsArr.length; ++i)
  {
    ctx.fillStyle = colors[i];
    curAngle =  (curAngle + 360 *(parseInt(cellsArr[i]['height']) / sumNumbersOfTable)) % 360;
    if (choosenColor != undefined)
    {
      if ((colors[i].toString() == choosenColor.toString()) || (darkColors[i].toString() == choosenColor.toString())
      || (ColorLuminance(colors[i], 0.6).toString() == choosenColor.toString()) || (ColorLuminance(colors[i], 0.8).toString() == choosenColor.toString()))
      {
        ctx.fillStyle = ColorLuminance(colors[i], 0.8);
        ShowHelp(cellsArr[i]["top"], ColorLuminance(colors[i], 0.8));
      }
    }
    var x = 0.0;
    var y = 0.0;
    var angle = 0.0;
    if (curAngle < prevAngle)
    {
      angle = ((360 - prevAngle + curAngle)/ 2 + prevAngle) % 360;
      x = innerRad * Math.cos(angle * Math.PI / 180);
      y = innerRad * Math.sin(angle * Math.PI / 180);
    }
    else {
      angle = ((curAngle - prevAngle) / 2 + prevAngle) % 360;
      x = innerRad * Math.cos(angle * Math.PI / 180);
      y = innerRad * Math.sin(angle * Math.PI / 180);
    }
    ctx.DrawSector(zeroPoint + x, zeroPoint - j + 1 - y, radiusX, radB, GradToRadians(prevAngle), GradToRadians(curAngle));
    prevAngle = curAngle;
  }
}

$(function() {
    $('#click-elem').click(function()
    {
        $('#overlay').fadeIn('fast',function()
        {
            $('#nonebox').animate({'top':'160px'},500);
        });
    });
    $('#box-close').click(function()
    {
        $('#nonebox').animate({'top':'-1000px'},500,function(){
            $('#overlay').fadeOut('fast');
        });
    });
    $("#pieChart").on({
    mouseenter: function()
    {
        autoRotation = false;
    },
    mouseleave: function()
    {
        autoRotation = true;
        userRotation = false;
        lightMode = false;
    },
    mouseup: function(e)
    {
      if (e.button == 0)
      {
        userRotation = false;
      }
    },
    mousedown: function(e)
    {
      if (e.button == 0)
      {
        userRotation = true;
      }
    },
    mousemove: function(event)
    {
        curX = event.pageX - $(this).offset().left;
        curY = event.pageY - $(this).offset().top;
        choosenColor = undefined;
        if ((Math.abs(curX - prevX) > 10) && (Math.abs(curY - prevY) > 10))
        {
          lightMode = true;
        }
    }
  });
});

function Update()
{
  if (userRotation)
  {
    var deltaX = curX - 250.0;
    var deltaY = curY - 210.0;
    if (Math.abs(deltaX) > Math.abs(deltaY))
    {
      if (curX - prevX > 0)
      {
        shiftAngle = (shiftAngle - 5) % 360;
      }
      if (curX - prevX < 0)
      {
        shiftAngle = (shiftAngle + 5) % 360;
      }
    }
    else
    {
      if (curY - prevY > 0)
      {
        inclineAngle = inclineAngle > 30 ? inclineAngle -= 2 : 30 ;
      }
      if (curY - prevY < 0)
      {
        inclineAngle = inclineAngle < 60 ? inclineAngle += 2 : 60;
      }
    }
    prevX = curX;
    prevY = curY;
  }

  if (lightMode)
  {
    var pixel = ctx.getImageData(curX, curY, curX, curY);
    var color = {};
    color["r"] = pixel.data[0];
    color["g"] = pixel.data[1];
    color["b"] = pixel.data[2];
    lastColor = choosenColor;
    choosenColor = ToHEX(color["r"], color["g"], color["b"]);
  }

  if (autoRotation)
  {
    shiftAngle = (shiftAngle + stepConst) % 360;
  }

  if (autoRotation || userRotation || lightMode)
  {
    DrawPieChart();
    lightMode = false;
  }

}

function ShowHelp(message, color)
{
  var canvas = document.getElementById("choosenSector");
  canvas.height = 50;
  canvas.width = 200;
  var ctx = canvas.getContext("2d");
  ctx.shadowColor = color;
  ctx.shadowOffsetX = 5;
  ctx.shadowOffsetY = 5;
  ctx.shadowBlur = 5;
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.strokeRect(0,0, canvas.width, canvas.height);
  ctx.font = "italic 12pt Arial";
  ctx.fillText(message, 10, 25, 180);
}

function HelpClear()
{
  var canvas = document.getElementById("choosenSector");
  var ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function ToHEX(r, g, b)
{
    return '#' + ((b | g << 8 | r << 16) | 1 << 24).toString(16).slice(1);
}
