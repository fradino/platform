<template>
  <header class="toolbar toolbar-header">
    <div class="toolbar-actions">
      <div class="btn-group" v-if="is_connected">
        <button class="btn btn-default" title="Back to connections"
                @click="requestDisconnect"
        >
          <span class="icon icon-left"></span>
        </button>

        <button class="btn btn-default" title="Refresh table data"
                @click="refreshQueryResults"
        >
          <span class="icon icon-cw"></span>
        </button>
      </div>

      <div class="btn-group" v-if="is_chart_showed">
        <button class="btn btn-default" @click="expendAll">
          <span class="icon icon-resize-full"></span>
        </button>
        <button class="btn btn-default" @click="collapseAll">
          <span class="icon icon-resize-small"></span>
        </button>
      </div>

      <div class="btn-group" v-if="is_connected&&!run_mode">
        <button class="btn btn-default" title="New item"
                @click="showNewRecordForm"
        >
          <span class="icon icon-plus-squared icon-text"></span>
          New item
        </button>
      </div>

      <button class="btn btn-default pull-right" v-if="is_connected" @click="switchMode">
        <span class="icon icon-switch"></span>
      </button>
    </div>
  </header>
</template>

<script>
  import {mapState, mapActions} from 'vuex'
  import tree from './views/Chart/DoubleTree'

  export default {
    name: 'Toolbar',

    computed: {
      ...mapState([
        "run_mode",
        'is_connected',
        "is_chart_showed"
      ])
    },

    methods: {
      ...mapActions([
          'request',
          'refreshQueryResults',
          'showNewRecordForm',
          'switchMode'
        ],
      ),

      requestDisconnect() {
        this.request({channel: 'disconnect-request'})
      },

      expendAll() {
        tree.methods.expendAll()
      },
      collapseAll() {
        tree.methods.collapseAll()
      }
    },


  }
</script>

