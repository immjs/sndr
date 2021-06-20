<template>
  <div class="wrapper">
    <div class="panel" id="p1">
      <h1>Sending API calls has <b>just became easier</b></h1><br/>
      <p>With sndr, you can make API wrappers or test your API in keystrokes!</p>
      <h2>If you're making an API:</h2>
      <highlight-code lang="js">{{example.self}}</highlight-code>
    </div>
    <div class="panel" id="p2">
      
    </div>
  </div>
</template>

<script>
export default {
  data(){return {
    example: {
      self: `import { config } from 'dotenv'
config();
import Sndr from 'sndr';

const APISndr = new Sndr({
  base: 'https://localhost:3000',
  basic: {
    headers: {
      Authorization: process.env.SECRET_DEV
    }
  }
});

APISndr.makeSndr({
  name: 'ping',
  path: '/ping',
  
});`,
    }
  }}
}
</script>

<style>
.panel, .wrapper {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

#p1 {
  background-color: #045de9;
  background-image: linear-gradient(315deg, #045de9 0%, #09c6f9 74%);
}

.hljs {
  background-color: #151515 !important;
}
</style>
