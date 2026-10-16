console.log("script読み込み成功");
const hamburger = document.getElementById("hamburger");
const menu = document.getElementById("menu");
const overlay = document.getElementById("overlay");
console.log(hamburger);
console.log(menu);
console.log(overlay);
hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  menu.classList.toggle("open");
  overlay.classList.toggle("active");
});

function updateMemberCount() {
    fetch("http://localhost:3000/members")
        .then(response => response.json())
        .then(data => {
            console.log("取得した人数:", data.members);

            const container = document.getElementById("member-count");
            if (!container) return;

            const newValue = String(data.members);
            const oldValue = container.dataset.value || "";

            // 初回
            if (!oldValue) {
                container.innerHTML = "";

                [...newValue].forEach(digit => {
                    const digitBox = document.createElement("span");
                    digitBox.className = "digit";
                    digitBox.textContent = digit;
                    container.appendChild(digitBox);
                });

                container.dataset.value = newValue;
                return;
            }

            // 桁数が変わった場合
            if (oldValue.length !== newValue.length) {
                container.innerHTML = "";

                [...newValue].forEach(digit => {
                    const digitBox = document.createElement("span");
                    digitBox.className = "digit";
                    digitBox.textContent = digit;
                    container.appendChild(digitBox);
                });

                container.dataset.value = newValue;
                return;
            }

            const oldDigits = [...oldValue];
            const newDigits = [...newValue];

            container.innerHTML = "";

            newDigits.forEach((newDigit, i) => {
                const digitBox = document.createElement("span");
                digitBox.className = "digit";

                // 変わった数字だけアニメーション
                if (oldDigits[i] !== newDigit) {
                    const oldDigit = document.createElement("span");
                    oldDigit.className = "digit-old";
                    oldDigit.textContent = oldDigits[i];

                    const newDigitElement = document.createElement("span");
                    newDigitElement.className = "digit-new";
                    newDigitElement.textContent = newDigit;

                    digitBox.appendChild(oldDigit);
                    digitBox.appendChild(newDigitElement);
                } else {
                    digitBox.textContent = newDigit;
                }

                container.appendChild(digitBox);
            });

            container.dataset.value = newValue;
        })
        .catch(error => {
            console.error("人数取得エラー:", error);
        });
}

updateMemberCount();
setInterval(updateMemberCount, 10000);

// 画面内に要素が入ったら「is-show」クラスを付けて表示させる処理
document.addEventListener("DOMContentLoaded", () => {
  const targets = document.querySelectorAll('.about-title');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // 画面内に少しでも入ったら発火
      if (entry.isIntersecting) {
        entry.target.classList.add('is-show');
      }
    });
  }, {
    threshold: 0.2 // 要素が20%見えたらアニメーションを開始する
  });

  targets.forEach(target => observer.observe(target));
});

document.addEventListener("DOMContentLoaded", () => {
  // .scroll-line を持つすべての行を取得
  const scrollLines = document.querySelectorAll('.scroll-line');

  const lineObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // 画面内に入ったら is-show クラスを付けて表示
        entry.target.classList.add('is-show');
        // 一度表示されたら監視を解除（スクロールを戻しても消えないようにする）
        observer.unobserve(entry.target);
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -10% 0px', // 画面の下から10%の位置に入ったら発火
    threshold: 0.1
  });

  scrollLines.forEach(line => lineObserver.observe(line));
});

// ハンバーガーメニューからページへ移動
menu.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener("click", (event) => {
        event.preventDefault();

        const targetId = link.getAttribute("href").slice(1);
        const target = document.getElementById(targetId);

        console.log("クリックされたリンク:", targetId);
        console.log("移動先:", target);

        if (!target) {
            console.error("移動先が見つかりません！");
            return;
        }

        // メニューを閉じる
        hamburger.classList.remove("active");
        menu.classList.remove("open");
        overlay.classList.remove("active");

        // 少しだけ遅延させてメニューが閉じた後のレイアウトに合わせることで確実にする
        setTimeout(() => {
            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }, 100);
    });
});