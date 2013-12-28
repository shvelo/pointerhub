var pid, name;

if("localStorage" in window && "name" in localStorage) {
	var name = localStorage.name;
} else {
	name = window.prompt("wow enter your name") || "RandomDoge";

	if("localStorage" in window) {
		localStorage.name = name;
	}
}

$(".doge-me .name").text(name);

var host = location.origin.replace(/^http/, 'ws'),
	ws = new WebSocket(host),
	doges = [],
	online_text = "wow loading";

ws.onmessage = function (raw_data) {
	var data = JSON.parse(raw_data.data);

	pid = data.you.id;

	doges = data.doges;

	if (doges.length < 2) {
		online_text = "wow such alone.<br>much sad :(";
	} else {
		online_text = "wow <b>" + doges.length + "</b> doges online";
	}

	$(".doge:not(.doge-me)").remove();

	doges.forEach(function(doge) {
		if(doge.id == pid) return;
		$("#pointer-area").append("<div class='doge doge-" +
			doge.id +
			"'><span class=name>" +
			doge.name +
			"</span><span class=wow>WOW</span></div>");
		var doge_el = $(".doge-" + doge.id);
		doge_el.css({
			top: doge.y,
			left: doge.x
		});

		if(doge.wow) {
			doge_el.addClass("wow");
			setTimeout(function(){
				doge_el.removeClass("wow");
			}, 600);
		}
	});
}


$("body").on("mousemove", function(e) {
	try {
		ws.send(JSON.stringify({
			name: name,
			x: e.pageX,
			y: e.pageY,
			wow: false
		}));
		$(".doge-me").css({
			left: e.pageX,
			top: e.pageY
		})
	} catch (err) {
		console.warn(err);
	}
});
$("body").on("click", function(e) {
	try {
		ws.send(JSON.stringify({
			name: name,
			x: e.pageX,
			y: e.pageY,
			wow: true
		}));
		$(".doge-me").addClass("wow");
		setTimeout(function(){
			$(".doge-me").removeClass("wow");
		}, 600);
	} catch (err) {
		console.warn(err);
	}
});

var onlineSetter = setInterval(function() {
	$("#stats").html(online_text);
}, 500);