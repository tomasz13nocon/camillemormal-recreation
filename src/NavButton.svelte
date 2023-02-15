<script>
  import { state } from "./stores.js";
  export let dir;
  export let active;
  let left = (dir === "left");
  let rotate1 = "rotate(" + (active * 90) + "deg)";
  let rotate2 = "rotate(" + (90 + active * 90) + "deg)";
  $: rotate1 = "rotate(" + (active * 90) + "deg)";
  $: rotate2 = "rotate(" + (90 + active * 90) + "deg)";

  function shrink(node, { delay, transforms }) {
    return {
      delay: delay || 0,
      duration: 500,
      css: (t, u) => {
        return `width: ${20 * t}px; transform: translateX(${20 * u * 0.5}px) ${transforms}`;
      },
    };
  }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<div class="text-4xl absolute w-1/2 h-full font-bold p-2 z-20 select-none cursor-auto {left ? 'left-0' : 'right-0'} {$$props.class || ''}" on:click>
  <div class="absolute {left ? 'left-1/3' : 'right-1/3'} {left ? '' : '-translate-x-5'} top-1/2">
    <span
      class="bg-white/80 block h-[2px] w-5 transition-transform duration-700 ease-out-quint absolute"
      in:shrink={{ delay: 500, transforms: rotate1 }}
      out:shrink={{ transforms: rotate1 }}
      style:transform={rotate1}>
    </span>
    <span
      class="bg-white/80 block h-[2px] w-5 transition-transform duration-700 ease-out-quint absolute"
      in:shrink={{ delay: 500, transforms: rotate2 }}
      out:shrink={{ transforms: rotate2 + " translateX(0)" }}
      style:transform={rotate2}>
    </span>
  </div>
</div>

