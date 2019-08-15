import errorModal from '../utils/error-modal'
import queryResultExists from '../utils/query-result-exists'
import requestUtils from '../ipc/request-utils'
import channels from '../ipc/channels'
import tree from '../components/views/Chart/DoubleTree'

export default {
  ...requestUtils,

  /**
   * Initialize the application.
   */
  init ({ dispatch, commit }) {
    dispatch('subscribeToChannels', channels);

    dispatch('requestSync', { channel: 'get-connections-request' })
      .then(response => {
        commit('SET_SAVED_CONNECTIONS', response);
        commit('SET_INITIALIZED', true)
      });

    const nav_data = [{
      id: 0,
      label: '美国',
      children: []
    }, {
      id: 0,
      label: '日本',
      children: []
    }, {
      id: 0,
      label: '印度',
      children: []
    }, {
      id: 0,
      label: '台湾',
      children: []
    }, {
      id: 0,
      label: '俄罗斯',
      children: []
    }, {
      id: 0,
      label: '韩国',
      children: []
    }];

    commit('SET_NAV_DATA', nav_data);
  },

  handleError({ commit }, error) {
    commit('SET_LOADING', false);

    errorModal(error)
  },

  changeSelectedTable ({ commit }, table_name) {
    commit('SET_SELECTED_TABLE', table_name)
  },

  /**
   * Commit saved connections to state.
   *
   * @param {Array} saved_connections
   */
  handleGetConnections ({ commit }, { saved_connections }) {
    commit('SET_SAVED_CONNECTIONS', saved_connections)
  },

  /**
   * Handle a delete connection response.
   *
   * @param {Array} saved_connections
   */
  handleDeleteConnection ({ commit }, { saved_connections }) {
    commit('SET_SAVED_CONNECTIONS', saved_connections);
    commit('SET_LOADING', false)
  },

  /**
   * Grab saved connections and databases for the server connection.
   */
  handleConnection ({ commit, dispatch }) {
    commit('SET_IS_CONNECTED', true);
    commit('SET_LOADING', true);

    dispatch('request', { channel: 'databases-request' })
  },

  /**
   * Handle a disconnect response.
   */
  handleDisconnect ({ commit }) {
    commit('SET_IS_CONNECTED', false);
    commit('RESET_STATE');
    commit('SET_LOADING', false)
  },

  /**
   * Prepare the databases data from the results and fields and commit them to the state.
   *
   * @param {Array} results
   * @param {Array} fields
   */
  handleDatabases({ commit }, { results, fields }) {
    commit('RESET_STATE');

    commit('SET_DATABASES', results.map(res => res[fields[0].name]));

    commit('SET_LOADING', false)
  },

  handleTables({ commit }, { results, fields }) {
    commit('SET_SELECTED_TABLE', '');
    commit('SET_QUERY_RESULTS', []);

    const tables = results.map(res => res[fields[0].name]);
    commit('SET_TABLES', tables);

    commit('SET_LOADING', false)
  },

  handleTableData({ state, commit }, response) {
    const index = state.query_results.findIndex(result => result.table === response.table);
    const data = Object.assign(response, { type: 'SELECT' });

    if (index > -1) {
      commit('REPLACE_QUERY_RESULTS', {
        index,
        new_results: data
      })
    } else {
      commit('UPDATE_QUERY_RESULTS', data)
    }

    commit('SET_LOADING', false)
  },

  handleDescribeTable({ commit }, response) {
    commit('UPDATE_QUERY_RESULTS', Object.assign(response, { type: 'DESCRIBE' }));

    commit('SET_LOADING', false)
  },

  handleNavData({ state, commit }, response){
    commit('ADD_NAV_DATA', response);
    commit('SET_LOADING', false)
  },

  requestTableData({ state, commit, dispatch }, { table, limit = 10, offset = 0 }) {
    if (table) {
      commit('SET_SELECTED_TABLE', table)
    } else {
      table = state.selected_table
    }

    dispatch('request', {
      channel: 'table-data-request',
      payload: { table, limit, offset }
    })
  },

  /**
   * Request a DESCRIBE table query.
   *
   * @param {String} table_name
   */
  requestDescribeTable({ state, commit, dispatch }, table_name) {
    commit('SET_SELECTED_TABLE', table_name);

    if (!queryResultExists(state.query_results, 'DESCRIBE', table_name)) {
      dispatch('request', { channel: 'describe-table-request', payload: table_name })
    }
  },

  /**
   * Remove a query result by given index.
   *
   * @param {Number} index
   */
  removeQueryResult({ commit }, index) {
    commit('REMOVE_QUERY_RESULTS', index)
  },

  /**
   * Send a new table data request for the specified table,
   * or if no table was specified, send a request for each query result to refresh them.
   */
  refreshQueryResults ({ state, dispatch }, table = null) {
    if (table !== null) {
      const index = state.query_results.findIndex(qr => qr.table === table);

      if (index > -1) {
        const query = state.query_results[index];
        dispatch('requestTableData', {
          table: query.table,
          limit: query.limit,
          offset: query.offset
        })
      }
    } else {
      state.query_results.forEach(query => {
        dispatch('requestTableData', {
          table: query.table,
          limit: query.limit,
          offset: query.offset
        })
      })
    }
  },

  showNewRecordForm ({ commit }) {
    commit('SHOW_NEW_RECORD_FORM')
  },

  hideNewRecordForm ({ commit }) {
    commit('HIDE_NEW_RECORD_FORM')
  },

  /**
   * Dispatch a new record request.
   * Data should be an object whose key:value pairs correspond to column_name: column_value.
   *
   * @param {String} table Table name
   * @param {Object} data
   */
  newRecord ({ dispatch }, { table, data }) {
    dispatch('request', {
      channel: 'new-record-request',
      payload: {
        table,
        data
      }
    })
  },

  /**
   * Request a refresh of query results after a new record has been inserted.
   *
   * @todo Refactor this to just refresh the table where we added a new record
   */
  handleNewRecord ({ dispatch, commit }, response) {
    dispatch('refreshQueryResults', response.table);

    commit('HIDE_NEW_RECORD_FORM')
  },

  /**
   * Change state
   */
  switchMode({ state, commit }){
    if (state.run_mode){
      commit('CLOSE_RUN_MODE')
    }else {
      commit('OPEN_RUN_MODE')
    }
  },

  /**
   * handlePlatformChart
   * @param state
   * @param commit
   * @param response
   */
  handlePlatformChart({ state, commit }, response){

    console.log(response)

    var data=[];

    data.push({key: response.results[0].platform_type, c: 'lav', url: 'None', layer: 0});
    data.push({key: response.results[0].platform_name, parent: response.results[0].platform_type, dir: "right", c: 'yellow', url: 'None',layer: 1});

    data.push({key: "属性信息", parent: response.results[0].platform_name, c: 'yellow', url: 'None',layer: 2});
    data.push({key: "物理特征", parent: response.results[0].platform_name, c: 'yellow', url: 'None',layer: 2});
    data.push({key: "机动特征", parent: response.results[0].platform_name, c: 'yellow', url: 'None',layer: 2});
    data.push({key: "威胁特征", parent: response.results[0].platform_name, c: 'yellow', url: 'None',layer: 2});
    data.push({key: "时间事件", parent: response.results[0].platform_name, c: 'yellow', url: 'None',layer: 2});

    data.push({key: "国别", parent: "属性信息", c: 'yellow', url: 'None',layer: 3});
    data.push({key: "陆海空天/类型", parent: "属性信息", c: 'yellow', url: 'None',layer: 3});
    data.push({key: "战术用途", parent: "属性信息", c: 'yellow', url: 'None',layer: 3});
    data.push({key: "功能性能", parent: "属性信息", c: 'yellow', url: 'None',layer: 3});

    data.push({key: "长宽高", parent: "物理特征", c: 'yellow', url: 'None',layer: 3});
    data.push({key: "重量（载重）", parent: "物理特征", c: 'yellow', url: 'None',layer: 3});
    data.push({key: "外形照片", parent: "物理特征", c: 'yellow', url: response.results[0].phy_char_img,layer: 3});

    data.push({key: "航程", parent: "机动特征", c: 'yellow', url: 'None',layer: 3});
    data.push({key: "航速", parent: "机动特征", c: 'yellow', url: 'None',layer: 3});
    data.push({key: "飞行高度（下潜深度）", parent: "机动特征", c: 'yellow', url: 'None',layer: 3});
    data.push({key: "作战半径", parent: "机动特征", c: 'yellow', url: 'None',layer: 3});
    data.push({key: "（固定）部署位置", parent: "机动特征", c: 'yellow', url: 'None',layer: 3});

    data.push({key: "威胁等级", parent: "威胁特征", c: 'yellow', url: 'None',layer: 3});
    data.push({key: "威胁分析", parent: "威胁特征", c: 'yellow', url: 'None',layer: 3});

    data.push({key: response.results[0].attr_info_nationality, parent: "国别", url: 'None',layer: 4});
    data.push({key: response.results[0].attr_info_type, parent: "陆海空天/类型", url: 'None',layer: 4});
    data.push({key: response.results[0].attr_info_usage, parent: "战术用途", url: 'None',layer: 4});
    data.push({key: response.results[0].attr_info_property, parent: "功能性能", url: 'None',layer: 4});

    data.push({key: response.results[0].phy_char_lwh, parent: "长宽高", url: 'None',layer: 4});
    data.push({key: response.results[0].phy_char_weight, parent: "重量（载重）", url: 'None',layer: 4});

    data.push({key: response.results[0].mane_char_voyage, parent: "航程", url: 'None',layer: 4});
    data.push({key: response.results[0].mane_char_speed, parent: "航速", url: 'None',layer: 4});
    data.push({key: response.results[0].mane_char_height, parent: "飞行高度（下潜深度）", url: 'None',layer: 4});
    data.push({key: response.results[0].mane_char_radius, parent: "作战半径", url: 'None',layer: 4});
    data.push({key: response.results[0].mane_char_position, parent: "（固定）部署位置", url: 'None',layer: 4});

    data.push({key: response.results[0].threat_char_level, parent: "威胁等级", url: 'None',layer: 4});
    data.push({key: response.results[0].threat_char_analyze, parent: "威胁分析", url: 'None',layer: 4});

    data.push({key: '设备组成', parent: response.results[0].platform_type, c: 'yellow', dir: "left", url: 'None',layer: -1});
    data.push({key: '武器组成', parent: response.results[0].platform_type, c: 'yellow', dir: "left", url: 'None',layer: -1});

    data.push({key: '雷达设备', parent: '设备组成', c: 'yellow', url: 'None',layer: -2});
    data.push({key: '通信设备', parent: '设备组成', c: 'yellow', url: 'None',layer: -2});
    data.push({key: '导航设备', parent: '设备组成', c: 'yellow', url: 'None',layer: -2});
    data.push({key: '敌我识别设备', parent: '设备组成', c: 'yellow', url: 'None',layer: -2});
    data.push({key: '光电设备', parent: '设备组成', c: 'yellow', url: 'None',layer: -2});
    data.push({key: '水声设备', parent: '设备组成', c: 'yellow', url: 'None',layer: -2});
    data.push({key: '电子战设备', parent: '武器组成', c: 'yellow', url: 'None',layer: -2});
    data.push({key: '火力设备', parent: '武器组成', c: 'yellow', url: 'None',layer: -2});

    response.components.results.forEach(function (component, index) {
      data.push({key: component.type, parent: component.category, url: 'None',layer: -3});
    });

    response.time_event.results.forEach(function (te, index) {
      data.push({key: te.time, parent: '时间事件',c: 'yellow', url: 'None',layer: 3});
      data.push({key: te.event, parent: te.time, url: 'None',layer: 4});
    })

    commit('SET_CHART_DATA',data);
    commit('SET_LOADING', false)
  },



}
