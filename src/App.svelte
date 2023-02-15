<script>
  // @ts-nocheck
  import { state } from "./stores.js";
  import NavButton from "./NavButton.svelte";
  import { flip } from "svelte/animate";
  import { expoOut, quintOut } from "svelte/easing";

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

  // cubic-bezier(.33,1.1,.75,1)
  // cubic-bezier(.33,1.1,.76,.96)
  // cubic-bezier(.04,1.12,.85,.98)
  // cubic-bezier(0.15,0.82,0.22,0.99)
  // cubic-bezier(0.12,1.07,0.5,0.97) - close
  // cubic-bezier(0.12,1.07,0.5,0.99)
  // cubic-bezier(.1,1.09,.5,.99)

  function setActive(n) {
    if ($state === "landing" && n >= 0 && n <= imgs.length - 1) {
      active = n;
    }
  }

  function handleKey(e) {
    if (e.key === "ArrowLeft") setActive(active - 1);
    if (e.key === "ArrowRight") setActive(active + 1);
  }

  function handleScroll(e) {
    switch ($state) {
      case "landing":
        $state = "carousel";

        break;
      case "carousel":
        $state = "landing";
        break;
    }
  }

  $: if (skipTransition.length) {
    requestAnimationFrame(() => skipTransition = []);
  }

</script>

<svelte:window on:keydown={handleKey} on:mousewheel={handleScroll} />

<main class="mx-auto bg-zinc-900 text-zinc-50 h-screen">
  <div
    class="overflow-hidden transition-all duration-[1.6s] ease-out-smooth"
    style:width={$state === "carousel" ? "300px" : "100vw"}
    style:clip-path={$state === "carousel" ? "polygon(37vw 25vh, 37vw 75vh, 63vw 75vh, 63vw 25vh)" : "polygon(0vw 0vh, 0vw 100vh, 100vw 100vh, 100vw 0vh)"}
  >
    {#each imgs as src, i (src)}
      <!-- <img {src} alt="" class="w-screen h-screen object-cover" /> -->
      <div
        style:background-image="url({src})"
        class="z-10 h-screen w-screen shrink-0 bg-center bg-no-repeat absolute duration-[1.6s] ease-out-smooth"
        style:transition-property={skipTransition[i] ? "none" : "transform,background-position"}
        style:transform={`translateX(${i > active ? "100" : (i < active ? "-100" : "0")}%) scale(${$state === "landing" ? "1" : "0.7"})`}
        style:background-position={i > active ? "-50vw" : (i < active ? "50vw" : "0%")}
        style:z-index={Math.max(0, active-i)}
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
      <!-- svelte-ignore a11y-click-events-have-key-events -->
      <!-- style:scale={$state === "carousel" ? "0.7" : "0.05"} -->
      <!-- style:transition={`clip-path 1.6s ${$state === "carousel" ? (imgs.length - 1 - i) * 20 : i * 20}ms`} -->
      <div
        style:background-image="url({src})"
        class="shrink-0 bg-center bg-no-repeat bg-cover absolute right-0 bottom-0 transition-[clip-path] duration-[1.6s] ease-out-expo"
        style:width={$state === "carousel" ? "100vw" : "64px"}
        style:height={$state === "carousel" ? "100vh" : "36px"}
        style:transform={$state === "carousel" ? `translate(0, 0)` : `translate(-${48 + 68 * (imgs.length-1-i)}px, -48px)`}
        style:clip-path={$state === "carousel" ? "polygon(37vw 25vh, 37vw 75vh, 63vw 75vh, 63vw 25vh)" : "polygon(0px 0px, 0px 36px, 64px 36px, 64px 0px)"}
        animate:flip={{
          duration: 1600,
          delay: $state === "carousel" ? (imgs.length - 1 - i) * 20 : i * 20,
          easing: expoOut
        }}
        on:click={() => {
          // Skip transitions for slides in between
          let distance = Math.abs(active - i);
          while (--distance > 0) {
            skipTransition[Math.max(i, active) - (distance)] = true;
          }
          active = i;
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
      <!--     duration: 1600, -->
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
