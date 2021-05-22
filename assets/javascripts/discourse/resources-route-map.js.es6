export default function () {
  this.route("resources", { path: "/resources" }, function () {
    this.route("index", { path: "/" });
  });
}
