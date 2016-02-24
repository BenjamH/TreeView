describe ("TreeView Test", function() {

  var c;

  // before and after cases to assist with testing
  beforeEach(function() {
    var testData =
    { label: 'Node Label',items: [{label: 'Child Node Label', items: [{label: 'Child Node Label', items: [{label: 'Child Node Label', items: [] }, {label: 'Child Node Label', }, {label: 'Leaf Node Label'} ] } ] }, {label: 'Leaf Node Label'} ] };
    c = TreeView();
    c.setData(testData, 'label', 'items');
    c.render();
  });

  afterEach(function() {
    d3.selectAll('svg').remove();
  });

  //helper methods
  function getSvg() {
    return d3.select('svg');
  }

  function getNodes() {
    return d3.selectAll('.node')[0];
  }

  // svg test
  describe('the svg', function() {

    it('should be created', function() {
      expect(getSvg()).not.toBeNull();
    });

    it('should render correct number of nodes', function() {
      expect(getNodes().length).toBe(7);
    });

  });

  // data test
  describe('working with data', function() {

    it('should be able to update the data', function() {
      var testData = {
        name: "Hello", children:
          [{name: "Hi",
            children: [{name: "Bye"}]}]};
      c.setData(testData, 'name', 'children');
      expect(c.getData()).toEqual(testData);
    });

    it("should change data structure's properties to 'name' and 'children'", function(){

        formattedItems = c.getData();


        expect(formattedItems.name && formattedItems.children).toBeDefined();
    });

  });

});