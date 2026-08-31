(function () {
	var popover = document.createElement('div');
	popover.className = 'footnote-popover';
	document.body.appendChild(popover);

	function show(link) {
		var target = document.getElementById(link.getAttribute('href').slice(1));
		if (!target) return;
		var clone = target.cloneNode(true);
		var back = clone.querySelector('.reversefootnote');
		if (back) back.remove();
		popover.innerHTML = clone.innerHTML;
		popover.style.display = 'block';

		var rect = link.getBoundingClientRect();
		var left = rect.left;
		var maxLeft = window.innerWidth - popover.offsetWidth - 10;
		if (left > maxLeft) left = maxLeft;
		if (left < 10) left = 10;
		popover.style.left = left + 'px';
		popover.style.top = (rect.bottom + 6) + 'px';
	}

	function hide() {
		popover.style.display = 'none';
	}

	document.querySelectorAll('a.footnote').forEach(function (link) {
		link.addEventListener('mouseenter', function () { show(link); });
		link.addEventListener('mouseleave', hide);
	});
})();
