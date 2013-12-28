var pid, name;

if("localStorage" in window) {
	var pid = localStorage.pid;
	var name = localStorage.name;
} else {
	console.warn("localStorage not supported");
}

if(!pid || !name) {
	pid = Math.floor(Math.random() * 1000000);
	name = window.prompt("Enter your name") || "user"+pid;

	if("localStorage" in window) {
		localStorage.pid = pid;
		localStorage.name = name;
	}
}

console.log("pid:" . pid);
console.log("name:" . name);

var host = location.origin.replace(/^http/, 'ws'),
	ws = new WebSocket(host),
	dawgs = {},
	online = [0, 0],
	online_text = "";

ws.onmessage = function (data) {
	dawgs = JSON.parse(data.data);
	//console.log(dawgs);
	$.each(dawgs, function(index, dawg) {
		if (index == pid) {
			return 1;
		} else if (index == "stats") {
			online = dawg;
			if (online[0] < 1) {
				online_text = "Loading data...";
			} else if (online[0] == 1) {
				online_text = "Sorry, <b>you are alone</b> here."
					+ "<br>ask someone to join :)";
			} else {
				online_text = "<b>" + online[0]
					+ "</b> people online";
			}
			return 1;
		} else if (dawg == null) {
			$(".dawg-" + index).remove();
			return 1;
		}

		var d = $(".dawg-" + index);

		if (!!d.length) {
			var op = (!!dawg.a) ? "1" : "0.5";
			$(d[0]).css({
				top: dawg.y + "px",
				left: dawg.x + "px",
				opacity: op
			});

			if(dawg.wow) {
				var wow = dawg.find(".wow");
				wow.show();
				setTimeout(function(){
					wow.hide();
				}, 100)
			}
		} else {
			$("#pointer-area").append("<div class='dawg dawg-" +
				index +
				"'><span>" +
				dawg.n +
				"</span><span class=wow>WOW</span></div>");
		}
	});
}


$("body").on("mousemove", function(e) {
	try {
		ws.send(JSON.stringify({
			id: pid,
			lb: name,
			mx: e.pageX,
			my: e.pageY,
			wow: false
		}));
	} catch (err) {
		console.warn("wow much error");
	}
});
$("body").on("click", function(e) {
	try {
		ws.send(JSON.stringify({
			id: pid,
			lb: name,
			mx: e.pageX,
			my: e.pageY,
			wow: true
		}));
	} catch (err) {
		console.warn("wow much error");
	}
});

var onlineSetter = setInterval(function() {
	$("#stats").html(online_text);
}, 500);