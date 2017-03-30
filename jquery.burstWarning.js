/*
 * jQuery BurstWarning Plugin
 * https://github.com/uncop4500/jQuery.BurstWarning
 */

(function ($) {
	$.burstWarning = function (caption, message1, message2, message3, options) {
		if (!isValidString(caption) || !isValidString(message1) || !isValidString(message2) || !isValidString(message3)) {
			return;
		}

		var settings = {
			mode: "AC",	// 演出パターン

			// 背景の設定値
			bgFadeInTime: 300,		// 背景フェードインのアニメーション時間
			bgShowTimeBefore: 1000,	// 背景フェードイン後、文字表示アニメーション開始までに背景のみを表示している時間
			bgShowTimeAfter: 300,	// 文字消去アニメーション終了後、背景フェードアウト開始までに背景のみを表示している時間
			bgFadeOutTime: 300,		// 背景フェードアウトのアニメーション時間

			// ACモードの設定値
			dbac: {
				// 見出しの設定値
				caption: {
					showDelayTime: 200,		// ある文字が表示アニメーションを開始してから、次の文字が表示アニメーションを開始するまでの時間
					showAnimationTime: 2500,// 一文字あたりの表示アニメーション時間
					hideDelayTime: 150,		// ある文字が消去アニメーションを開始してから、次の文字が消去アニメーションを開始するまでの時間
					hideAnimationTime: 400,	// 一文字あたりの消去アニメーション時間
				},
				// メッセージの設定値
				message: {
					showDelayTime: 40,		// ある文字が表示アニメーションを開始してから、次の文字が表示アニメーションを開始するまでの時間
					showAnimationTime: 300,	// 一文字あたりの表示アニメーション時間
					hideDelayTime: 20,		// ある文字が消去アニメーションを開始してから、次の文字が消去アニメーションを開始するまでの時間
					hideAnimationTime: 150,	// 一文字あたりの消去アニメーション時間
					hideStartDelayTime: 500,// 見出しが消去アニメーションを開始してから、メッセージが消去アニメーションを開始するまでの時間
				},
				// その他の設定値
				allShowTime: 1700, // すべての表示アニメーションが完了してから、消去アニメーションを開始するまでの時間
			},
			// CSモードの設定値
			dbcs: {
				// 見出しの設定値
				caption: {
					color: "#FF0000",		// 文字色
					blurRatio: 0.1,			// 見出し文字サイズに対するぼかし具合の割合
					showAnimationTime: 650,	// 表示アニメーション時間
					waitTime: 100,			// 表示アニメーションが完了してから、消去アニメーションを開始するまでの時間
					hideAnimationTime: 650,	// 消去アニメーション時間
				},
				// メッセージの設定値
				message: {
					initSizeRatio: 1.8,		// 表示アニメーション完了後の文字サイズに対する表示開始時の文字サイズ割合
					showDelayTime: 40,		// ある文字が表示アニメーションを開始してから、次の文字が表示アニメーションを開始するまでの時間
					showAnimationTime: 500,	// 一文字あたりの表示アニメーション時間
				},
				// その他の設定値
				allShowTime: 2300,			// すべての表示アニメーションが完了してから、消去アニメーションを開始するまでの時間
				allHideAnimationTime: 650,	// 消去アニメーション時間
			},
		};

		settings = $.extend(true, settings, options);

		var fontSizeRatio;		// 見出しとメッセージのフォントサイズ比率
		var messageMarginRatio;	// メッセージとメッセージ上下のパディングの比率
		var dbcsCaptionBlur;	// CSモード見出しのぼかし具合

		// animate関数に渡すダミーのプロパティ
		var dummyProperties = { "dummy": "dummy" };

		// クラス名
		var marginTopClass;		// 上の余白領域に設定するクラス名
		var containerClass;		// 文字全体の領域に設定するクラス名
		var captionStringClass;	// 見出し文字に設定するクラス名
		var messageAreaClass;	// メッセージ領域に設定するクラス名
		var messageStringClass;	// メッセージ文字に設定するクラス名
		var marginBottomClass;	// 下の余白領域に設定するクラス名

		// わーにんを実行する関数
		var WARNING;

		if (settings.mode === "AC") {
			marginTopClass = "dbacMarginTop";
			containerClass = "dbacContainer";
			captionStringClass = "dbacCaptionString";
			messageStringClass = "dbacMessageString";
			marginBottomClass = "dbacMarginBottom";
			WARNING = dbacWarning;
		} else if (settings.mode === "CS") {
			marginTopClass = "dbcsMarginTop";
			containerClass = "dbcsContainer";
			captionStringClass = "dbcsCaptionString";
			messageStringClass = "dbcsMessageString";
			marginBottomClass = "dbcsMarginBottom";
			WARNING = dbcsWarning;
		} else {
			return;
		}

		// サウンドファイル読み込み
		var sound = new Audio(settings.sound);
		sound.load();

		// 表示する要素
		var $bg = $("<div />").attr("id", "burstWarningBg").addClass("burstWarningBg");
		var $marginTop = $("<div />").addClass(marginTopClass);
		var $container = $("<div />").attr("id", "burstWarningContainer").addClass(containerClass)
								.append($("<div />").attr("id", "burstWarningCaption").addClass("burstWarningCaption"))
								.append($("<div />").attr("id", "burstWarningMessage1").addClass("burstWarningMessage1"))
								.append($("<div />").attr("id", "burstWarningMessage2").addClass("burstWarningMessage2"))
								.append($("<div />").attr("id", "burstWarningMessage3").addClass("burstWarningMessage3"));
		var $marginBottom = $("<div />").addClass(marginBottomClass);

		var $burstWarningTarget = $("body");
		$burstWarningTarget.append(
			$bg.append($marginTop)
				.append($container)
				.append($marginBottom)
		);

		var $caption = $("#burstWarningCaption");
		var $message1 = $("#burstWarningMessage1");
		var $message2 = $("#burstWarningMessage2");
		var $message3 = $("#burstWarningMessage3");

		WARNING();

		// 有効な文字列かをチェック
		function isValidString(str) {
			return ($.type(str) === "string") && str;
		}

		// ACモードの演出
		function dbacWarning() {
			// 文字の要素を生成
			createElements()
				.then(function () {
					// 背景のフェードイン
					return $bg.fadeIn(settings.bgFadeInTime).promise();
				})
				.then(function () {
					// 背景のみが表示されている状態
					// この時間を利用してフォントサイズの調整をおこなう
					return $.when(wait(settings.bgShowTimeBefore), adjust());
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
					return $.when(showCaption(), dbacShowMessage());
				})
				.then(function () {
					// すべての文字が表示されている状態
					return wait(settings.dbac.allShowTime);
				})
				.then(function () {
					// 文字消去のアニメーション
					// 見出しとメッセージがすべて消去完了したら次へ
					return $.when(hideCaptionAndMessage2(), hideMessage1(), hideMessage3());
				})
				.then(function () {
					// 背景のみが表示されている状態
					return wait(settings.bgShowTimeAfter);
				})
				.then(function () {
					// 背景のフェードアウト
					return $bg.fadeOut(settings.bgFadeOutTime).promise();
				})
				.then(function () {
					// フォントサイズ調整のイベントハンドラを削除
					$(window).off("resize", adjust);

					// BGごと要素を消してしまう
					$bg.remove();

					// コールバック関数を呼ぶ
					if ($.isFunction(settings.callback)) {
						settings.callback();
					}
				}, function () {
					// どこかで失敗した場合も、イベントハンドラ削除と要素の消去はやっておく
					$(window).off("resize", adjust);
					$bg.remove();
				});
		}

		// CSモードの演出
		function dbcsWarning() {
			// 文字の要素を生成
			createElements()
				.then(function () {
					// 背景のフェードイン
					return $bg.fadeIn(settings.bgFadeInTime).promise();
				})
				.then(function () {
					// 背景のみが表示されている状態
					// この時間を利用してフォントサイズの調整をおこなう
					return $.when(wait(settings.bgShowTimeBefore), adjust());
				})
				.then(function () {
					// 画面サイズ変更時にフォントサイズ調整
					$(window).on("resize", adjust);

					// サウンドを再生
					if (sound) {
						sound.play();
					}

					// まずは1回見出しを表示してフェードアウト
					return showDbcsCaption();
				})
				.then(function () {
					// ・見出しを2回目表示してフェードアウト、そのあと3回目を表示してそのまま
					// ・メッセージを1文字ずつ順に表示
					// すべて完了したら次へ
					return $.when(
							showDbcsCaption()
								.then(function () {
									return $caption.show().animate(dummyProperties, { duration: settings.dbcs.caption.showAnimationTime, step: animateShadow });
								}),
							dbcsShowMessage());
				})
				.then(function () {
					// すべての文字が表示されている状態
					return wait(settings.dbcs.allShowTime);
				})
				.then(function () {
					// 文字消去のアニメーション
					// 全部いっぺんにフェードアウト
					return $container.fadeOut(settings.dbcs.allHideAnimationTime).promise();
				})
				.then(function () {
					// 背景のみが表示されている状態
					return wait(settings.bgShowTimeAfter);
				})
				.then(function () {
					// 背景のフェードアウト
					return $bg.fadeOut(settings.bgFadeOutTime).promise();
				})
				.then(function () {
					// フォントサイズ調整のイベントハンドラを削除
					$(window).off("resize", adjust);

					// BGごと要素を消してしまう
					$bg.remove();

					// コールバック関数を呼ぶ
					if ($.isFunction(settings.callback)) {
						settings.callback();
					}
				}, function () {
					// どこかで失敗した場合も、イベントハンドラ削除と要素の消去はやっておく
					$(window).off("resize", adjust);
					$bg.remove();
				});
		}

		// 一文字ずつ分解して子要素を生成
		function createElements() {
			// 見出し
			for (var i = 0; i < caption.length; ++i) {
				$caption.append(
					$("<span />")
					.addClass(captionStringClass)
					.html(escape(caption.substr(i, 1)))
				);
			}
			// メッセージ1行目
			for (i = 0; i < message1.length; ++i) {
				$message1.append(
					$("<span />")
					.addClass(messageStringClass)
					.html(escape(message1.substr(i, 1)))
				);
			}
			// メッセージ2行目
			for (i = 0; i < message2.length; ++i) {
				$message2.append(
					$("<span />")
					.addClass(messageStringClass)
					.html(escape(message2.substr(i, 1)))
				);
			}
			// メッセージ3行目
			for (i = 0; i < message3.length; ++i) {
				$message3.append(
					$("<span />")
					.addClass(messageStringClass)
					.html(escape(message3.substr(i, 1)))
				);
			}

			fontSizeRatio = parseInt($message1.children().css("font-size")) / parseInt($caption.children().css("font-size"));
			messageMarginRatio = parseInt($message1.children().css("margin-top")) / parseInt($message1.children().css("font-size"));

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
				var $dummyContainer = $dummyBg.find("#burstWarningContainer").attr("id", "burstWarningDummyContainer");
				var $dummyCaption = $dummyBg.find("#burstWarningCaption").attr("id", "burstWarningDummyCaption").hide();
				var $dummyMessage1 = $dummyBg.find("#burstWarningMessage1").attr("id", "burstWarningDummyMessage1").hide();
				var $dummyMessage2 = $dummyBg.find("#burstWarningMessage2").attr("id", "burstWarningDummyMessage2").hide();
				var $dummyMessage3 = $dummyBg.find("#burstWarningMessage3").attr("id", "burstWarningDummyMessage3").hide();
				$burstWarningTarget.append($dummyBg);

				var containerWidth = $dummyContainer.width();
				var containerHeight = $dummyContainer.height();
				var contentsWidth = Math.max($dummyCaption.width(), $dummyMessage1.width(), $dummyMessage2.width(), $dummyMessage3.width());
				var contentsHeight = $dummyCaption.height() + $dummyMessage1.height() + $dummyMessage2.height() + $dummyMessage3.height();

				var $captionString = $dummyCaption.children("." + captionStringClass);
				var $messageString = $dummyContainer.find("." + messageStringClass);

				var titleFontSize = parseInt($captionString.css("font-size"), 10);

				// 表示領域からはみ出すまでフォントを拡大
				while (contentsWidth < containerWidth && contentsHeight < containerHeight) {
					titleFontSize *= Math.max((containerWidth / contentsWidth), (containerHeight / contentsHeight));
					$captionString.css("font-size", titleFontSize + "px");
					$messageString.css({
						"font-size": titleFontSize * fontSizeRatio + "px",
						"margin": titleFontSize * fontSizeRatio * messageMarginRatio + "px 0"
					});
					contentsWidth = Math.max($dummyCaption.width(), $dummyMessage1.width(), $dummyMessage2.width(), $dummyMessage3.width());
					contentsHeight = $dummyCaption.height() + $dummyMessage1.height() + $dummyMessage2.height() + $dummyMessage3.height();
				}

				// 表示領域に収まるようにフォントを縮小
				while (containerWidth < contentsWidth || containerHeight < contentsHeight) {
					titleFontSize *= Math.min((containerWidth / contentsWidth), (containerHeight / contentsHeight));
					$captionString.css("font-size", titleFontSize + "px");
					$messageString.css({
						"font-size": titleFontSize * fontSizeRatio + "px",
						"margin": titleFontSize * fontSizeRatio * messageMarginRatio + "px 0"
					});
					contentsWidth = Math.max($dummyCaption.width(), $dummyMessage1.width(), $dummyMessage2.width(), $dummyMessage3.width());
					contentsHeight = $dummyCaption.height() + $dummyMessage1.height() + $dummyMessage2.height() + $dummyMessage3.height();
				}

				// 表示用の要素に反映
				var messageFontSize = titleFontSize * fontSizeRatio;
				$("." + captionStringClass).css("font-size", titleFontSize + "px");
				$("." + messageStringClass).css({
					"font-size": messageFontSize + "px",
					"margin": messageFontSize * messageMarginRatio + "px 0"
				});
				dbcsCaptionBlur = titleFontSize * settings.dbcs.caption.blurRatio;

				// 調整用の要素を消す
				$dummyBg.remove();

				d.resolve();
			}, 0);

			return d.promise();
		}

		// 見出し表示（ACモード）
		function showCaption() {
			$caption.show();
			var lastAnimation;
			$caption.children().each(function (index, element) {
				lastAnimation = $(element).delay(settings.dbac.caption.showDelayTime * index)
										  .animate(dummyProperties, { duration: settings.dbac.caption.showAnimationTime, step: animateShowTransform });
			});
			return lastAnimation.promise();
		}

		// 見出し表示（CSモード）
		function showDbcsCaption() {
			return $caption
						.show()
						.animate(dummyProperties, { duration: settings.dbcs.caption.showAnimationTime, step: animateShadow })
						.promise()
						.then(function () {
							return wait(settings.dbcs.caption.waitTime);
						})
						.then(function(){
							return $caption.fadeOut(settings.dbcs.caption.hideAnimationTime).promise();
						});
		}

		// メッセージ表示（ACモード）
		function dbacShowMessage() {
			$message1.show();
			$message2.show();
			$message3.show();

			var lastAnimation;
			$message1.add($message2).add($message3).children().each(function (index, element) {
				lastAnimation = $(element).delay(settings.dbac.message.showDelayTime * index)
										  .animate(dummyProperties, { duration: settings.dbac.message.showAnimationTime, step: animateShowTransform });
			});

			return lastAnimation.promise();
		}

		// メッセージ表示（CSモード）
		function dbcsShowMessage() {
			$message1.show();
			$message2.show();
			$message3.show();

			// メッセージ文字の初期位置調整
			initMessagePosition($message1);
			initMessagePosition($message2);
			initMessagePosition($message3);

			var lastAnimation;
			$message1.add($message2).add($message3).children().each(function (index, element) {
				lastAnimation = $(element).delay(settings.dbcs.message.showDelayTime * index)
										  .animate(
											{
												"left": 0,
												"opacity": 1
											},
											{
												duration: settings.dbcs.message.showAnimationTime,
												step: animateDbcsShowMessage
											});
			});

			return lastAnimation.promise();
		}

		// メッセージ文字の初期位置調整（CSモード）
		function initMessagePosition($message) {
			var halfBlockWidth = $message.width() / ($message.children().length * 2);
			var offset = $message.offset().left;
			$message.children().each(function (index, element) {
				var blockCenter = offset + halfBlockWidth * (2 * index + 1);
				var elementCenter = $(element).offset().left + ($(element).width() / 2);
				$(element).css("left", (blockCenter - elementCenter) + "px");
			});
		}

		// 見出し消去（ACモード）
		function hideCaptionAndMessage2() {
			var lastAnimation;
			$caption.children().each(function (index, element) {
				$(element).delay(settings.dbac.caption.hideDelayTime * index)
						  .animate(dummyProperties, { duration: settings.dbac.caption.hideAnimationTime, step: animateHideTransform });
				if ($caption.children().length - 1 == index) {
					// 末尾の文字と同時にメッセージ2行目消去
					lastAnimation = $message2.children()
							.delay(settings.dbac.caption.hideDelayTime * index)
							.animate(dummyProperties, { duration: settings.dbac.message.hideAnimationTime, step: animateHideTransform });
				}
			});
			return lastAnimation.promise();
		}

		// メッセージ1行目を先頭から末尾に向かって消去（ACモード）
		function hideMessage1() {
			var lastAnimation;
			$message1.children().each(function (index, element) {
				// 末尾の文字が最後に処理される
				lastAnimation = $(element)
						.delay(settings.dbac.message.hideStartDelayTime + settings.dbac.message.hideDelayTime * index)
						.animate(dummyProperties, { duration: settings.dbac.message.hideAnimationTime, step: animateHideTransform });
			});
			return lastAnimation.promise();
		}

		// メッセージ3行目を末尾から先頭に向かって消去（ACモード）
		function hideMessage3() {
			var lastAnimation;
			var length = $message3.children().length - 1;
			$message3.children().each(function (index, element) {
				var temp = $(element)
							.delay(settings.dbac.message.hideStartDelayTime + settings.dbac.message.hideDelayTime * (length - index))
							.animate(dummyProperties, { duration: settings.dbac.message.hideAnimationTime, step: animateHideTransform });
				if (index == 0) {
					// 先頭文字が最後に処理される
					lastAnimation = temp;
				}
			});
			return lastAnimation.promise();
		}

		// 文字表示時の伸縮アニメーション（ACモード）
		function animateShowTransform(now, fx) {
			$(fx.elem).css({
				"transform": "scaleY(" + fx.pos + ")",
				"-webkit-transform": "scaleY(" + fx.pos + ")"
			});
		}

		// 文字消去時の伸縮アニメーション（ACモード）
		function animateHideTransform(now, fx) {
			$(fx.elem).css({
				"transform": "scaleY(" + (1 - fx.pos) + ")",
				"-webkit-transform": "scaleY(" + (1 - fx.pos) + ")"
			});
		}

		// 見出し表示時のぼかしアニメーション（CSモード）
		function animateShadow(now, fx) {
			$(fx.elem).children().css("text-shadow", "0 0 " + (dbcsCaptionBlur * (1 - fx.pos)) + "px " + settings.dbcs.caption.color);
		}

		// メッセージ表示時の縮小アニメーション（CSモード）
		function animateDbcsShowMessage(now, fx) {
			var ratio = 1 + (1 - fx.pos) * (settings.dbcs.message.initSizeRatio - 1);
			var value = "scale(" + ratio + ", " + ratio + ")";
			$(fx.elem).css({
				"transform": value,
				"-webkit-transform": value,
			});
		}
	};
})(jQuery);
