(function (root) {
	root.ContentEditable = function (selector, options) {
		var defaults = {
			keyElementMap: {
				"P-9": function (event, selection, currentNode) {
					var range = selection.getRangeAt(0);
					var tabChar = root.document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
					range.insertNode(tabChar);
					range.setStartAfter(tabChar);
					range.setEndAfter(tabChar);
					selection.removeAllRanges();
					selection.addRange(range);
					return true;
				},
				"P-13": function (event, selection, currentNode) {
					var newP = root.document.createElement("p");
					newP.innerHTML = "<br/>"
					currentNode.parentNode.insertBefore(newP, null);
					range = selection.getRangeAt(0);
					range.setStartAfter(newP);
					range.collapse(true);
					selection.removeAllRanges();
					selection.addRange(range);
					return true;
				},
				"FIGURE-13": function (event, selection, currentNode) {
					var newP = root.document.createElement("p");
					newP.innerHTML = "<br/>"
					currentNode.parentNode.parentNode.insertBefore(newP, null);
					range = selection.getRangeAt(0);
					range.setStartAfter(newP);
					range.collapse(true);
					selection.removeAllRanges();
					selection.addRange(range);
					return true;
				},
				"FIGCAPTION-13": function (event, selection, currentNode) {
					var newP = root.document.createElement("p");
					newP.innerHTML = "<br/>"
					currentNode.parentNode.parentNode.parentNode.insertBefore(newP, null);
					range = selection.getRangeAt(0);
					range.setStartAfter(newP);
					range.collapse(true);
					selection.removeAllRanges();
					selection.addRange(range);
					return true;
				},
				"TH-9": function (event, selection, currentNode) {
					var targetNode = currentNode.nextSibling || currentNode.parentNode.parentNode.nextSibling.firstChild.firstChild;
					selectElementContents(targetNode);
					return true;
				},
				"TD-8": function(event, selection, currentNode){
					var parentNode = currentNode.parentNode;
					var columns = [].slice.call(parentNode.querySelectorAll("td"));	
					if(trueForAll(columns, function(column, colIndex){
						return column.innerHTML === "<br>" || column.innerHTML === "<br />" || column.innerText === "\n" || column.innerText === "" || column.innerText === "\r\n";
					})){
						var grandParentNode = parentNode.parentNode;
						grandParentNode.removeChild(parentNode);
						var newTarget = grandParentNode.querySelector("tr:last-child td:last-child") || grandParentNode.querySelector("tr:last-child th:last-child");
						selectElementContents(newTarget);
						return true;
					}
					return false;
				},
				"TD-9": function (event, selection, currentNode) {
					var targetNode = currentNode.nextSibling;
					if (targetNode === null) {
						if (currentNode.parentNode.nextSibling) {
							targetNode = currentNode.parentNode.nextSibling.firstChild.firstChild;
						}
						else {
							targetNode = currentNode.parentNode.parentNode.parentNode.parentNode;
						}
					}

					if (targetNode) {
						selectElementContents(targetNode);
					}

					return true;
				},
				"TD-13": function (event, selection, currentNode) {
					var row = currentNode.parentNode;
					var tbody = row.parentNode;
					var newRow = root.document.createElement("tr");
					var columnCount = row.querySelectorAll("td").length;
					for (var i = 1; i <= columnCount; i++) {
						var td = root.document.createElement("td");
						td.innerText = "NR:C" + i;
						newRow.appendChild(td);
					}
					tbody.insertBefore(newRow, row.nextSibling);
					selectElementContents(newRow.querySelectorAll("td")[0]);
					return true;
				},
				"H1-13": function (event, selection, currentNode) {
					var newP = root.document.createElement("p");
					newP.innerHTML = "<br/>"
					currentNode.parentNode.insertBefore(newP, null);
					range = selection.getRangeAt(0);
					range.setStartAfter(newP);
					range.collapse(true);
					selection.removeAllRanges();
					selection.addRange(range);
					return true;
				},
				"H2-13": function (event, selection, currentNode) {
					var newP = root.document.createElement("p");
					newP.innerHTML = "<br/>"
					currentNode.parentNode.insertBefore(newP, null);
					range = selection.getRangeAt(0);
					range.setStartAfter(newP);
					range.collapse(true);
					selection.removeAllRanges();
					selection.addRange(range);
					return true;
				},
				"H3-13": function (event, selection, currentNode) {
					var newP = root.document.createElement("p");
					newP.innerHTML = "<br/>"
					currentNode.parentNode.insertBefore(newP, null);
					range = selection.getRangeAt(0);
					range.setStartAfter(newP);
					range.collapse(true);
					selection.removeAllRanges();
					selection.addRange(range);
					return true;
				},
				"PRE-13": function(event, selection, currentNode){
					var range = selection.getRangeAt(0);
					var newLine = document.createTextNode("\n");
					range.deleteContents();
					range.insertNode(newLine);
					range.setStartAfter(newLine);
					range.setEndAfter(newLine);
					range.collapse(false);
					selection.removeAllRanges();
					selection.addRange(range);
					return true;
				},
				"PRE-9": function (event, selection, currentNode) {
					var range = selection.getRangeAt(0);
					var tabChar = root.document.createTextNode("\u00a0\u00a0\u00a0\u00a0");
					range.insertNode(tabChar);
					range.setStartAfter(tabChar);
					range.setEndAfter(tabChar);
					selection.removeAllRanges();
					selection.addRange(range);
					return true;
				}
			}
		};
		var opts = extend({}, defaults, options);
		var elements = root.document.querySelectorAll(selector);
		forEach(elements, function (e, i) { transformElement(e, opts) });
	}

	function createToolbar(element) {
		var toolbar = root.document.createElement("div");
		toolbar.id = guid();
		element.dataset.toolbar = toolbar.id;
		toolbar.classList.add("content-editable-toolbar");
		toolbar.innerHTML = "<button name=\"inserth1\">h1</button><button name=\"inserth2\">h2</button><button name=\"inserth3\">h3</button><button name=\"insertTable\">table</button><button name=\"insertImage\">image</button><button name=\"insertCode\">code</button>";
		toolbar.querySelector("[name=inserth1]").onclick = function (event) {
			var header = root.document.createElement("h1");
			header.innerText = "Like you can write H1...";
			insertElementAfterCaretNode(root.getSelection(), header, element);
			selectElementContents(header);
		}

		toolbar.querySelector("[name=inserth2]").onclick = function (event) {
			var header = root.document.createElement("h2");
			header.innerText = "Like you can write H2...";
			insertElementAfterCaretNode(root.getSelection(), header, element);
			selectElementContents(header);
		}

		toolbar.querySelector("[name=inserth3]").onclick = function (event) {
			var header = root.document.createElement("h3");
			header.innerText = "Like you can write H3...";
			insertElementAfterCaretNode(root.getSelection(), header, element);
			selectElementContents(header);
		}

		toolbar.querySelector("[name=insertTable]").onclick = function (event) {

			function createTHeadCell(cellText) {
				var th = document.createElement("th");
				th.innerText = cellText;
				return th;
			}

			var numberOfColumns = prompt("# of columns", 3);
			var numberOfRows = prompt("# of rows", 2);
			var table = root.document.createElement("table");
			var caption = table.createCaption();
			caption.innerHTML = "<strong>Table #.</strong> Table Title";
			var thead = table.createTHead();
			var tbody = table.createTBody();
			var theadRow = thead.insertRow();
			for (var i = 1; i <= numberOfColumns; i++) {
				theadRow.appendChild(createTHeadCell("Header " + i));
			}
			for (var i = 1; i <= numberOfRows; i++) {
				var row = tbody.insertRow();
				for (var j = 1; j <= numberOfColumns; j++) {
					row.insertCell().innerText = "R" + i + ":C" + j;
				}
			}

			var p = root.document.createElement("p");
			p.appendChild(table);
			insertElementAfterCaretNode(root.getSelection(), p, element)			
		}

		toolbar.querySelector("[name=insertImage]").onclick = function (event) {
			var src = prompt("Image url");
			if (src === null) {
				return;
			}

			var image = root.document.createElement("img");
			image.src = src;
			var figure = root.document.createElement("figure");
			var figCaption = root.document.createElement("figcaption");
			figCaption.innerHTML = "<b>Figure #.</b> Figure caption."
			figure.appendChild(image);
			figure.appendChild(figCaption);
			var paragraph = root.document.createElement("p");
			paragraph.appendChild(figure);
			insertElementAfterCaretNode(root.getSelection(), paragraph, element);
			selectElementContents(figCaption);
		}

		toolbar.querySelector("[name=insertCode]").onclick = function(event){
			var figure = root.document.createElement("figure");
			var preFormatted = root.document.createElement("pre");
			preFormatted.innerText = "Some code...";
			var figCaption = root.document.createElement("figCaption");
			figCaption.innerHTML = "<b>Figure #.</b> Figure caption."
			figure.appendChild(preFormatted);
			figure.appendChild(figCaption);
			var paragraph = document.createElement("p");
			paragraph.appendChild(figure);
			insertElementAfterCaretNode(root.getSelection(), paragraph, element);
			selectElementContents(figCaption);			
		}

		return toolbar;
	}

	function transformElement(element, options) {
		element.setAttribute("contenteditable", true);
		element.classList.add("content-editable");
		var toolbar = createToolbar(element);
		element.parentNode.insertBefore(toolbar, element.nextSibling);
		var observer = new MutationObserver(function (mutations) {
			forEach(mutations, function (mutation) {
				if (mutation.target.childNodes.length === 0) {
					var newP = root.document.createElement("p");
					newP.innerHTML = "<br />";
					mutation.target.appendChild(newP);
				}
			});
		});

		observer.observe(element, { childList: true });

		element.onkeydown = function (event) {
			var selection = window.getSelection();
			var currentNode = getSelectionParentElement(selection);
			var key = currentNode.tagName + "-" + event.keyCode;
			if (options.keyElementMap[key]) {
				if(options.keyElementMap[key](event, selection, currentNode))
				{
					event.preventDefault();
				}
			}
			else{
				console.log(event.keyCode);
			}
		}

		element.onfocus = function (event) {
			root.document.getElementById(element.dataset.toolbar).style.display = "block";
		}

		element.onblur = function (event) {
			if (event.relatedTarget && event.relatedTarget.parentNode) {
				if (event.relatedTarget.parentNode.id === element.dataset.toolbar) {
					event.preventDefault();
					return;
				}
				else {
					root.document.getElementById(element.dataset.toolbar).style.display = "none";
				}
			}
			else {
				root.document.getElementById(element.dataset.toolbar).style.display = "none";
			}
		}

	}

	function insertElementAfterCaretNode(selection, element, container) {
		if(selection.anchorNode === container){
			container.removeChild(container.querySelector("p"));
			container.insertBefore(element, null);
		}
		if(selection.anchorNode.parentNode === container){			
			container.insertBefore(element, selection.anchorNode.nextSibling);
			container.removeChild(selection.anchorNode);
		}
		else{
			container.insertBefore(element, selection.anchorNode.parentNode.nextSibling);
		}
	}

	function selectElementContents(element) {
		var range = root.document.createRange();
		range.selectNodeContents(element);
		var selection = root.getSelection();
		selection.removeAllRanges();
		selection.addRange(range);
	}

	function getSelectionParentElement(selection) {
		var parentElement = null;
		if (selection.rangeCount) {
			parentElement = selection.getRangeAt(0).commonAncestorContainer;
			if (parentElement.nodeType != 1) {
				parentElement = parentElement.parentNode;
			}
		}

		return parentElement;
	}

	function guid() {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
			s4() + '-' + s4() + s4() + s4();
	}

	function extend(merged) {
		merged = merged || {};

		for (var i = 1; i < arguments.length; i++) {
			if (!arguments[i]) {
				continue;
			}

			for (var key in arguments[i]) {
				if (arguments[i].hasOwnProperty(key)) {
					merged[key] = arguments[i][key]
				};
			}
		}

		return merged;
	}


	function forEach(array, fn) {
		for (var i = 0; i < array.length; i++) {
			fn(array[i], i);
		}
	}

	function trueForAll(array, fn){		
		for(var i = 0; i < array.length; i++){
			var itemCond = fn(array[i], i);
			if(typeof(itemCond) !== "boolean" || !itemCond){
				return false;
			}
		}
		return true;
	}
})(window);