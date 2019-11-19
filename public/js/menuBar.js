//menubar
class MyMenu extends HTMLElement {
  constructor() {
    super();
    this.innerHTML = `
      <div id="menuWrapper">
        <div class="menuItem">
          <img src="images/menu_lists_grey.svg" alt="lists" title="lists" /><p>Lists</p>
        </div>
        <div class="menuItem">

          <img src="images/statistics-bar.svg" alt="statistics" title="statistics" />Statistics

          <img src="images/tasks_grey.svg" alt="tasks" title="tasks" /><p>Tasks</p>
        </div>
        <div class="menuItem">
          <img
            src="images/menu_profile_grey.svg"
            alt="profile"
            title="profile"
          /><p>Profile</p>
        </div>
        <img src="images/MyPlanner.svg" alt="Logo" title="Logo"/>
      </div>`;
    let lists = this.querySelector(".menuItem");
    let statistics = this.querySelectorAll(".menuItem")[1];
    let profile = this.querySelectorAll(".menuItem")[2];
    lists.addEventListener("click", this.clickLists);
    statistics.addEventListener("click", this.clickStatistics);
    profile.addEventListener("click", this.clickProfile);
  }

  clickLists() {
    redirectUser("showlists.html");
  }
  clickStatistics() {
    console.log("statistics clicked");
  }
  clickProfile() {
    redirectUser("profile.html");
  }
}

customElements.define("my-menu", MyMenu);
