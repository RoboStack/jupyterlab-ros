// return function()
// {
//   return {
//     id: 'mydynamicplugin',
//     autoStart: true,
//     requires: ["@jupyterlab/apputils:ICommandPalette"],
//     activate: function(app, palette) {
//       console.log("Hello from a dynamically loaded plugin!");
//       let commandID = "MySuperCoolDynamicCommand";
//       let toggle = true;
//       app.commands.addCommand(commandID, {
//         label: 'My Super Cool Dynamic Command',
//         isToggled: function() {
//           return toggle;
//         },
//         execute: function() {
//           console.log("Executed " + commandID);
//           toggle = !toggle;
//         }
//       });

//       palette.addItem({
//         command: commandID,
//         category: 'AAA',
//         args: {}
//       });
//     }
//   };
// }

return function()
{
    return {
      id: '@jupyterlab/notebook-extension:asaxdsa',
      autoStart: true,
      requires: ["@jupyterlab/statusbar:IStatusBar"],
      activate: (app, statusBar) => {
          console.log("Adding status bar item entr.");
          let widgets = require(["@lumino/widgets"], (widgets_mod) => {
          console.log("widgets: ", widgets_mod);
            
          });
        if (!statusBar) {
          // Automatically disable if statusbar missing
          return;
        }
        const { shell } = app;
          const item = Phosphor.Widget()
//         const item = new CommandEditStatus();

//         // Keep the status item up-to-date with the current notebook.
//         tracker.currentChanged.connect(() => {
//           const current = tracker.currentWidget;
//           item.model.notebook = current && current.content;
//         });
//         let status_item = {
//             item: Label('test'),
//             align: "left",
//             rank: 10,
//             isActive = () => { return true; },
//         };

        statusBar.registerStatusItem('@jupyterlab/notebook-extension:mode-status', {
          item,
          align: 'right',
          rank: 4,
          isActive: () =>
            true
        });
      }
    };
}