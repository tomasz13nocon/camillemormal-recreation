<script>
  // @ts-nocheck
  import { state } from "./stores.js";
  import NavButton from "./NavButton.svelte";
  import { flip } from "svelte/animate";
  import { expoOut, quintOut } from "svelte/easing";
  import { spring } from "svelte/motion";

  // let imgs = import.meta.glob("./assets/pics/*.jpg");
  let imgs = [
    "jean-beller-BPk54EnPmgY-unsplash.jpg",
    "lien-van-win-bjjoRIaeHvA-unsplash.jpg",
    "lien-van-win-H6LFgtj7fXY-unsplash.jpg",
    "maciek-sulkowski-W4PgnlbD8aI-unsplash.jpg",
    "marek-piwnicki-ZBvUxUvWwFw-unsplash.jpg",
    "max-harlynking-JdQjLfOslLI-unsplash.jpg",
    "s-tsuchiya-2UpH_leC9vc-unsplash.jpg",
    "brent-pace-Fv7ASdsihlo-unsplash.jpg",
    "falaq-lazuardi-EY7D79nsPiY-unsplash.jpg",
  ];
  imgs = imgs.map(s => "/imgs/" + s);

  let active = 0;
  let skipTransition = [];
  let delay = false;
  let carouselScroll = 0;//spring(0, { damping: 0.3, stiffness: 0.4 });
  const bgPosMax = 180;
  let innerWidth = 1, innerHeight = 1; // init to 1 to avoid `ar` being NaN
  $: ar = innerWidth / innerHeight;
  $: hvw = innerWidth / 2; // half viewport width
  $: d = (ar > 16/9 ? (innerHeight/2) * 0.76 : hvw * 0.48);

  function setActive(n) {
    if ($state === "landing" && n >= 0 && n <= imgs.length - 1) {
      active = n;
    }
  }

  function handleKey(e) {
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") setActive(active - 1);
    if (e.key === "ArrowRight" || e.key === "ArrowDown") setActive(active + 1);
  }

  function handleScroll(e) {
    switch ($state) {
      case "landing":
        $state = "carousel";
        carouselScroll = active * 320;
        delay = true;
        break;
      case "carousel":
        carouselScroll += e.deltaY * 0.5;
        break;
    }
  }

  function calcCarouselX(i, carouselScroll, ar) {
    // i * 320 - carouselScroll - window.innerWidth / 2 + "px";
    let r = ar > 16/9 ?
      //                         0.7 - img aspect ratio, 0.06 - gap
      `calc(50% + ${i} * (50vh * 0.76) - 50vw - ${carouselScroll}px)` :
      `calc(50% + ${i} * 24vw - 50vw - ${carouselScroll}px)`;
    // console.log(r);
    return r;
  }

  $: if (skipTransition.length) {
    requestAnimationFrame(() => skipTransition = []);
    // TODO: maybe instead of raf try afterUpdate or whatever
  }
  $: if (delay) {
    requestAnimationFrame(() => delay = false);
  }

  function calcTranslate(i, active, state) {
    let r = 0;
    if (i > active) r = 100;
    else if (i < active) r = -100;
    if (state === "carousel") {
      // return `calc(${r}% - ${carouselScroll}px)`;
    }
    return `${r}%`;
  }

</script>

<svelte:window on:keydown={handleKey} on:mousewheel={handleScroll} bind:innerWidth bind:innerHeight />

<main class="mx-auto bg-zinc-900 text-zinc-50 h-screen">
  <div class="absolute top-8 left-8 text-2xl font-bold flex flex-col z-50">
    <div>{Math.floor(carouselScroll)}</div>
    <div>active: {active}</div>
  </div>
  <!-- style:width={$state === "carousel" ? "300px" : "100vw"} -->
  <!-- style:clip-path={$state === "carousel" ? "polygon(37vw 25vh, 37vw 75vh, 63vw 75vh, 63vw 25vh)" : "polygon(0vw 0vh, 0vw 100vh, 100vw 100vh, 100vw 0vh)"} -->
<!--   style:clip-path={$state === "carousel" ? -->
<!--     `polygon(${ar > 16/9 ? -->
<!-- "32.5vh 25vh, 32.5vh 75vh, 67.5vh 75vh, 67.5vh 25vh" : -->
<!-- "39vw 34.285vw, 39vw 65.715vw, 61vw 65.715vw, 61vw 34.285vw"})` : -->
<!--     "polygon(0vw 0vh, 0vw 100vh, 100vw 100vh, 100vw 0vh)"} -->
  <div
    class="overflow-hidden duration-[1.5s] ease-out-smooth relative h-screen w-screen translate-x-12 flex items-center justify-center"
    style:transform={`translateX(${$state === "carousel" ? calcCarouselX(active, carouselScroll, ar) : "0"})`}
    style:transition-property={skipTransition[active] ? "none" : "transform, background-position, clip-path"}
  >
    {#each imgs as src, i (src)}
      <!-- <img {src} alt="" class="w-screen h-screen object-cover" /> -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <div
        style:background-image="url({src})"
        class="z-10 h-screen w-screen shrink-0 bg-center bg-no-repeat absolute duration-[1.5s] ease-out-smooth"
        style:transition-property={skipTransition[i] ? "none" : "width, height, transform, background-position, background-size"}
        style:width={$state === "carousel" ? (ar > 16/9 ? "35vh" : "22vw") : "100vw"}
        style:height={$state === "carousel" ? (ar > 16/9 ? "50vh" : "31.43vw") : "100vh"}
        style:display={$state === "carousel" && active !== i ? "none" : "block"}
        style:background-size={$state === "carousel" ?
          (ar > 3/2 ? "80vw 53.33vw" : "120vh 80vh") :
          (ar > 3/2 ? "100vw 66.66vw" : "150vh 100vh")}
        style:transform={`translateX(${calcTranslate(i, active, $state)})`}
        style:background-position={$state === "carousel" ?
      // For details on this formula see `math.png`
          `calc(50% + (${bgPosMax}px * ${i * (d / hvw) + (-carouselScroll / hvw)}))` :
          (i > active ? "-50vw" : (i < active ? "50vw" : "center"))
        }
        style:z-index={Math.max(0, active-i)}
        on:click={() => {
          if ($state === "carousel") {
            setActive(i); // unnecessary
            $state = "landing";
            delay = true;
          }
        }}
      ></div>
    {/each}
  </div>
  {#if $state === "landing"}
    <NavButton dir="left" {active} on:click={() => setActive(active - 1)} />
  {/if}
  {#if $state === "landing"}
    <NavButton dir="right" {active} on:click={() => setActive(active + 1)} />
  {/if}
  <div
    class="z-30 flex gap-1"
  >
    {#each imgs as src, i (src)}
      <!-- {#if i === 3} -->
      <!--   {console.log("d: " + d)} -->
      <!--   {console.log("scr / hvw: " + (-carouselScroll / hvw))} -->
      <!--   {console.log(i * (d / hvw) + (carouselScroll / hvw))} -->
      <!-- {/if} -->
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- style:scale={$state === "carousel" ? "0.7" : "0.05"} -->
      <!-- style:transition={`clip-path 1.5s ${$state === "carousel" ? (imgs.length - 1 - i) * 20 : i * 20}ms`} -->
      <!-- animate:flip={{ -->
      <!--   duration: 1500, -->
      <!--   delay: $state === "carousel" ? (imgs.length - 1 - i) * 20 : i * 20, -->
      <!--   easing: expoOut -->
      <!-- }} -->
      <!-- style:clip-path={$state === "carousel" && active !== i ? -->
      <!--   (ar > 16/9 ? -->
      <!--     "polygon(0vw 25vh, 0vw 75vh, 100vw 75vh, 100vw 25vh)" : -->
      <!--     "auto") : -->
      <!--   "polygon(0vw 0vh, 0vw 100vh, 100vw 100vh, 100vw 0vh)"} -->
      <!-- style:aspect-ratio={$state === "carousel" ? 0.7 : 16/9} -->
      <div
        style:background-image="url({src})"
        class="shrink-0 bg-no-repeat absolute right-0 bottom-0 duration-[1.5s] ease-out-smooth linear z-30"
        style:transition-property={skipTransition[i] ? "none" : "clip-path, transform, width, height, background-position, background-size"}
        style:transition-delay={delay ? i * 25 + "ms" : null}
        style:background-size={$state === "carousel" && active !== i ?
          (ar > 3/2 ? "80vw 53.33vw" : "120vh 80vh") :
          (ar > 3/2 ? "64px 36px" : "64px 36px")}
        style:width={$state === "carousel" && active !== i ? (ar > 16/9 ? "35vh" : "22vw") : "64px"}
        style:height={$state === "carousel" && active !== i ? (ar > 16/9 ? "50vh" : "31.43vw") : "36px"}
        style:transform={$state === "carousel" ?
          (active === i ?
            `translate(-${48 + 68 * (imgs.length-1-i)}px, 40px)` :
            `translate(calc(${calcCarouselX(i, carouselScroll, ar)}), calc(-50vh + 50%))`)
          :
          `translate(-${48 + 68 * (imgs.length-1-i)}px, -48px)`
        }
        style:background-position={$state === "carousel" && active !== i ?
          // For details on this formula see `math.png`
          `calc(50% + (${bgPosMax}px * ${i * (d / hvw) + (-carouselScroll / hvw)}))` :
          // `calc(50% + ${(carouselScroll - i * 320) / (innerWidth / 2) * bgPosMax}px)` :
          // `calc(50% - (${calcCarouselX(i, carouselScroll, ar)} - 50vw) * ${0.2})` :
          "center"
        }
        on:click={() => {
          switch ($state) {
            case "landing":
              // Skip transitions for slides in between
              let distance = Math.abs(active - i);
              while (--distance > 0) {
                skipTransition[Math.max(i, active) - (distance)] = true;
              }
              active = i;
              break;
            case "carousel":
              // skipTransition[active] = true;
              // skipTransition[i] = true;
              skipTransition = Array(imgs.length);
              skipTransition.fill(true);
              active = i;
              // setTimeout(() => {
              requestAnimationFrame(() => { $state = "landing"; delay = true; });
              // }, 2000);
              break;
          }
        }}
      ></div>
      <!-- <div -->
      <!--   style:background-image="url({src})" -->
      <!--   class="shrink-0 bg-center bg-no-repeat bg-cover ease-out-expo top-0 left-0" -->
      <!--   style:position={$state === "carousel" ? "absolute" : "static"} -->
      <!--   style:width={$state === "carousel" ? "100vw" : "64px"} -->
      <!--   style:height={$state === "carousel" ? "100vh" : "36px"} -->
      <!--   style:transform={$state === "carousel" ? `translate(${0}, 0)` : "translate(-48px, -48px)"} -->
      <!--   style:clip-path={"polygon(37vw 25vh, 37vw 75vh, 63vw 75vh, 63vw 25vh)"} -->
      <!--   animate:flip={{ -->
      <!--     duration: 1500, -->
      <!--     delay: $state === "carousel" ? (imgs.length - 1 - i) * 20 : i * 20, -->
      <!--     easing: expoOut -->
      <!--   }} -->
      <!--   on:click={() => { -->
      <!--     // Skip transitions for slides in between -->
      <!--     let distance = Math.abs(active - i); -->
      <!--     while (--distance > 0) { -->
      <!--       skipTransition[Math.max(i, active) - (distance)] = true; -->
      <!--     } -->
      <!--     active = i; -->
      <!--   }} -->
      <!-- ></div> -->
    {/each}
  </div>
</main>

<style>
</style>
