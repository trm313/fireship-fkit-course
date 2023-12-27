<script lang="ts">
  import { user, userData } from "$lib/firebase";
  import "../app.css";
  import Header from "$lib/components/Header.svelte";

  // Globally subscribe to stores to preload data
  $user;
  $userData;
</script>

<div class="min-h-screen flex flex-col">
  <Header />
  <slot />
</div>
