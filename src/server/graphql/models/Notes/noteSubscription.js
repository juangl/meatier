import r from '../../../database/rethinkdriver';
import {GraphQLBoolean} from 'graphql';
import {isLoggedIn} from '../authorization';

export default {
  getAllNotes: {
    type: GraphQLBoolean,
    async resolve (source, args, {rootValue, fieldName}) {
      isLoggedIn(rootValue);
      const {socket} = rootValue;
      r.table('notes')
        .changes({includeInitial: true})
        .run({cursor: true}, (err, cursor) => {
          if (err) throw err;
          cursor.each((err, data) => {
            if (err) throw err;
            const docId = data.new_val ? data.new_val.id : data.old_val.id;
            socket.docQueue.has(docId) ? socket.docQueue.delete(docId) : socket.emit(fieldName, data);
          });
          socket.on('unsubscribe', channelName => {
            if (channelName === fieldName) {
              cursor && cursor.close();
            }
          })
        });
      return true;
    }
  }
}

