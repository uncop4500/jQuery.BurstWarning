/*
 * jQuery BurstWarning Plugin
 * https://github.com/uncop4500/jQuery.BurstWarning
 */

(function ($) {
	$.burstWarning = function (caption, message1, message2, message3, options) {
		if (!isValidString(caption) || !isValidString(message1) || !isValidString(message2) || !isValidString(message3)) {
			return;
		}

		// 背景の設定値
		var bgFadeInTime = 300;		// 背景フェードインのアニメーション時間
		var bgShowTimeBefore = 1000;// フェードイン後、表示アニメーション開始までに背景のみを表示している時間
		var bgShowTimeAfter = 300;	// 消去アニメーション終了後、フェードアウト開始までに背景のみを表示している時間
		var bgFadeOutTime = 300;	// 背景画面フェードアウトのアニメーション時間

		// 見出しの設定値
		var captionShowDelayTime = 200;		// 次の文字が表示アニメーションを開始するまでの時間
		var captionShowAnimationTime = 2500;// 一文字あたりの表示アニメーション時間
		var captionHideDelayTime = 150;		// 次の文字が消去アニメーションを開始するまでの時間
		var captionHideAnimationTime = 400;	// 一文字あたりの消去アニメーション時間

		// メッセージの設定値
		var messageShowDelayTime = 40;			// 次の文字が表示アニメーションを開始するまでの時間
		var messageShowAnimationTime = 300;		// 一文字あたりの表示アニメーション時間
		var messageHideDelayTime = 20;			// 次の文字が消去アニメーションを開始するまでの時間
		var messageHideAnimationTime = 150;		// 一文字あたりの消去アニメーション時間
		var messageHideStartDelayTime = 500;	// 見出しが消去アニメーションを開始してから、メッセージが消去アニメーションを開始するまでの時間

		var allShowTime = 1700; // すべての表示アニメーションが完了してから、消去アニメーションを開始するまでの時間

		options = $.extend({}, options);

		// わーにん完了後に呼ぶコールバック関数
		var callback = options.callback;

		// 見出しとメッセージのフォントサイズ比率
		var fontSizeRatio = 1;

		// 文字表示時のアニメーション用パラメータ
		var showTransform = { "transform": "matrix(1, 0, 0, 1, 0, 0)" }

		// 文字消去時のアニメーション用パラメータ
		var hideTransform = { "transform": "matrix(1, 0, 0, 0, 0, 0)" };

		// サウンドファイル読み込み
		var sound = new Audio(options.sound);
		sound.load();

		// 表示する要素
		var $bg = $("<div />").attr("id", "burstWarningBg").addClass("burstWarningBg");
		var $marginTop = $("<div />").addClass("burstWarningMarginTop");
		var $container = $("<div />").attr("id", "burstWarningContainer").addClass("burstWarningContainer")
								.append($("<div />").attr("id", "burstWarningCaption").addClass("burstWarningCaption"))
								.append($("<div />").attr("id", "burstWarningMessage1").addClass("burstWarningMessage1"))
								.append($("<div />").attr("id", "burstWarningMessage2").addClass("burstWarningMessage2"))
								.append($("<div />").attr("id", "burstWarningMessage3").addClass("burstWarningMessage3"));
		var $marginBottom = $("<div />").addClass("burstWarningMarginBottom");

		$burstWarningTarget = $("body");
		$burstWarningTarget.append(
			$bg.append($marginTop)
				.append($container)
				.append($marginBottom)
		);

		var $caption = $("#burstWarningCaption");
		var $message1 = $("#burstWarningMessage1");
		var $message2 = $("#burstWarningMessage2");
		var $message3 = $("#burstWarningMessage3");

		// 文字の要素を生成
		createElements()
			.then(function () {
				// 背景のフェードイン
				return $bg.fadeIn(bgFadeInTime).promise();
			})
			.then(function () {
				// 背景のみが表示されている状態
				// この時間を利用してフォントサイズの調整をおこなう
				return $.when(wait(bgShowTimeBefore), adjust());
			})
			.then(function () {
				// 画面サイズ変更時にフォントサイズ調整
				$(window).on("resize", adjust);

				// サウンドを再生
				if (sound) {
					sound.play();
				}

				// 文字表示のアニメーション
				// 見出しとメッセージがすべて表示完了したら次へ
				return $.when(showCaption(), showMessage());
			})
			.then(function () {
				// すべての文字が表示されている状態
				return wait(allShowTime);
			})
			.then(function () {
				// 文字消去のアニメーション
				// 見出しとメッセージがすべて消去完了したら次へ
				return $.when(hideCaptionAndMessage2(), hideMessage1(), hideMessage3());
			})
			.then(function () {
				// 背景のみが表示されている状態
				return wait(bgShowTimeAfter);
			})
			.then(function () {
				// 背景のフェードアウト
				return $bg.fadeOut(bgFadeOutTime).promise();
			})
			.then(function () {
				// フォントサイズ調整のイベントハンドラを削除
				$(window).off("resize", adjust);

				// BGごと要素を消してしまう
				$bg.remove();

				// コールバック関数を呼ぶ
				if ($.isFunction(callback)) {
					callback();
				}
			}, function () {
				// どこかで失敗した場合も、イベントハンドラ削除と要素の消去はやっておく
				$(window).off("resize", adjust);
				$bg.remove();
			});

		// 有効な文字列かをチェック
		function isValidString(str) {
			return ($.type(str) === "string") && str;
		}

		// 一文字ずつ分解して子要素を生成
		function createElements() {
			// 見出し
			for (var i = 0; i < caption.length; ++i) {
				$caption.append(
					$("<span />")
					.addClass("burstWarningCaptionString")
					.html(escape(caption.substr(i, 1)))
				);
			}
			// メッセージ1行目
			for (i = 0; i < message1.length; ++i) {
				$message1.append(
					$("<span />")
					.addClass("burstWarningMessageString")
					.html(escape(message1.substr(i, 1)))
				);
			}
			// メッセージ2行目
			for (i = 0; i < message2.length; ++i) {
				$message2.append(
					$("<span />")
					.addClass("burstWarningMessageString")
					.html(escape(message2.substr(i, 1)))
				);
			}
			// メッセージ3行目
			for (i = 0; i < message3.length; ++i) {
				$message3.append(
					$("<span />")
					.addClass("burstWarningMessageString")
					.html(escape(message3.substr(i, 1)))
				);
			}

			fontSizeRatio = parseInt($message1.children().css("font-size"), 10) / parseInt($caption.children().css("font-size"), 10);

			// 非表示にしておく
			return $.when(
					$caption.hide().promise(),
					$message1.hide().promise(),
					$message2.hide().promise(),
					$message3.hide().promise());
		}

		// HTML特殊文字をエスケープ
		function escape(src) {
			if (!src) {
				return "";
			}
			return src.replace(/&/g, "&amp;")
					  .replace(/</g, "&lt;")
					  .replace(/>/g, "&gt;")
					  .replace(/"/g, "&quot;")
					  .replace(/'/g, "&#39;")
					  .replace(/\s/g, "&nbsp;");
		}

		// 指定したミリ秒だけ待機
		function wait(time) {
			var d = $.Deferred();
			setTimeout(function () {
				d.resolve();
			}, time);
			return d.promise();
		}

		// 文字サイズを画面に合わせて調節
		function adjust() {
			var d = $.Deferred();

			setTimeout(function () {
				// フォントサイズ調整用に裏で使う要素を生成
				var $dummyBg = $("#burstWarningBg").clone()
									.attr('id', 'burstWarningDummyBg')
									.css("z-index", $("#burstWarningBg").css("z-index") - 1);
				var $dummyContainer = $dummyBg.find(".burstWarningContainer").attr("id", "burstWarningDummyContainer");
				var $dummyCaption = $dummyBg.find(".burstWarningCaption").attr("id", "burstWarningDummyCaption").hide();
				var $dummyMessage1 = $dummyBg.find(".burstWarningMessage1").attr("id", "burstWarningDummyMessage1").hide();
				var $dummyMessage2 = $dummyBg.find(".burstWarningMessage2").attr("id", "burstWarningDummyMessage2").hide();
				var $dummyMessage3 = $dummyBg.find(".burstWarningMessage3").attr("id", "burstWarningDummyMessage3").hide();
				$burstWarningTarget.append($dummyBg);

				var containerWidth = $dummyContainer.width();
				var containerHeight = $dummyContainer.height();
				var contentsWidth = Math.max($dummyCaption.width(), $dummyMessage1.width(), $dummyMessage2.width(), $dummyMessage3.width());
				var contentsHeight = $dummyCaption.height() + $dummyMessage1.height() + $dummyMessage2.height() + $dummyMessage3.height();

				var $captionString = $dummyCaption.children(".burstWarningCaptionString");
				var $messageString = $dummyContainer.find(".burstWarningMessageString");

				var fontBaseSize = parseInt($captionString.css("font-size"), 10);

				// 表示領域からはみ出すまでフォントを拡大
				while (contentsWidth < containerWidth && contentsHeight < containerHeight) {
					fontBaseSize *= Math.max((containerWidth / contentsWidth), (containerHeight / contentsHeight));
					$captionString.css("font-size", fontBaseSize + "px");
					$messageString.css("font-size", fontBaseSize * fontSizeRatio + "px");
					contentsWidth = Math.max($dummyCaption.width(), $dummyMessage1.width(), $dummyMessage2.width(), $dummyMessage3.width());
					contentsHeight = $dummyCaption.height() + $dummyMessage1.height() + $dummyMessage2.height() + $dummyMessage3.height();
				}

				// 表示領域に収まるようにフォントを縮小
				while (containerWidth < contentsWidth || containerHeight < contentsHeight) {
					fontBaseSize *= Math.min((containerWidth / contentsWidth), (containerHeight / contentsHeight));
					$captionString.css("font-size", fontBaseSize + "px");
					$messageString.css("font-size", fontBaseSize * fontSizeRatio + "px");
					contentsWidth = Math.max($dummyCaption.width(), $dummyMessage1.width(), $dummyMessage2.width(), $dummyMessage3.width());
					contentsHeight = $dummyCaption.height() + $dummyMessage1.height() + $dummyMessage2.height() + $dummyMessage3.height();
				}

				// 表示用の要素に反映
				$(".burstWarningCaptionString").css("font-size", fontBaseSize + "px");
				$(".burstWarningMessageString").css("font-size", fontBaseSize * fontSizeRatio + "px");

				// 調整用の要素を消す
				$dummyBg.remove();

				d.resolve();
			}, 0);

			return d.promise();
		}

		// 見出し表示
		function showCaption () {
			$caption.show();
			var lastAnimation;
			$caption.children().each(function (index, element) {
				lastAnimation = $(element).delay(captionShowDelayTime * index).animate(showTransform, captionShowAnimationTime);
			});
			return lastAnimation.promise();
		}

		// メッセージ表示
		function showMessage() {
			$message1.show();
			$message2.show();
			$message3.show();

			var count = 0;
			$message1.children().each(function (index, element) {
				$(element).delay(messageShowDelayTime * count).animate(showTransform, messageShowAnimationTime);
				++count;
			});

			$message2.children().each(function (index, element) {
				$(element).delay(messageShowDelayTime * count).animate(showTransform, messageShowAnimationTime);
				++count;
			});

			var lastAnimation;
			$message3.children().each(function (index, element) {
				lastAnimation = $(element).delay(messageShowDelayTime * count).animate(showTransform, messageShowAnimationTime);
				++count;
			});

			return lastAnimation.promise();
		}

		// 見出し消去
		function hideCaptionAndMessage2 () {
			var lastAnimation;
			$caption.children().each(function (index, element) {
				$(element).delay(captionHideDelayTime * index).animate(hideTransform, captionHideAnimationTime);
				if ($caption.children().length - 1 == index) {
					// 末尾の文字と同時にメッセージ2行目消去
					lastAnimation = $message2.children()
							.delay(captionHideDelayTime * index)
							.animate(hideTransform, messageHideAnimationTime);
				}
			});
			return lastAnimation.promise();
		}

		// メッセージ1行目を先頭から末尾に向かって消去
		function hideMessage1 () {
			var lastAnimation;
			$message1.children().each(function (index, element) {
				// 末尾の文字が最後に処理される
				lastAnimation = $(element)
						.delay(messageHideStartDelayTime + messageHideDelayTime * index)
						.animate(hideTransform, messageHideAnimationTime);
			});
			return lastAnimation.promise();
		}

		// メッセージ3行目を末尾から先頭に向かって消去
		function hideMessage3 () {
			var lastAnimation;
			var length = $message3.children().length - 1;
			$message3.children().each(function (index, element) {
				var temp = $(element)
							.delay(messageHideStartDelayTime + messageHideDelayTime * (length - index))
							.animate(hideTransform, messageHideAnimationTime);
				if (index == 0) {
					// 先頭文字が最後に処理される
					lastAnimation = temp;
				}
			});
			return lastAnimation.promise();
		}
	};

	// 文字の伸縮アニメーション
	$.fx.step.transform = function (fx) {
		if (!fx.start || !fx.end) {
			return;
		}

		// fx.startやfx.endは"matrix(1, 0, 0, 1, 0, 0)"のような文字列
		var index1 = fx.start.indexOf("(") + 1;
		var index2 = fx.start.indexOf(")");
		var startArray = fx.start.substring(index1, index2).split(",");
		index1 = fx.end.indexOf("(") + 1;
		index2 = fx.end.indexOf(")");
		var endArray = fx.end.substring(index1, index2).split(",");

		//var startX = Number(startArray[0]);
		var startY = Number(startArray[3]);
		//var endX = Number(endArray[0]);
		var endY = Number(endArray[3]);

		// 縦の拡大率のみ適用
		$(fx.elem)
			.css("transform", "scale(1, " + (startY + (endY - startY) * fx.pos) + ")")
			.css("-webkit-transform", "scale(1, " + (startY + (endY - startY) * fx.pos) + ")");
	};

	// Impactが表示できない場合の代替フォント読み込み
	// Google Fontsの自動生成コード
	(function () {
		WebFontConfig = {
			google: { families: ['Anton::latin,latin-ext'] }
		};
		var wf = document.createElement('script');
		wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
		  '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
		wf.type = 'text/javascript';
		wf.async = 'true';
		var s = document.getElementsByTagName('script')[0];
		s.parentNode.insertBefore(wf, s);
	}());
})(jQuery);
