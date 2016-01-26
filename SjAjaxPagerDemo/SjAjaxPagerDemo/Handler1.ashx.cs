using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;

namespace SjAjaxPagerDemo
{
    /// <summary>
    /// Summary description for Handler1
    /// </summary>
    public class Handler1 : IHttpHandler
    {

        public void ProcessRequest(HttpContext context)
        {
            //这两个参数为固定参数
            var pageindex = Convert.ToInt32(context.Request["pageIndex"]);
            var pageSize = Convert.ToInt32(context.Request["pageSize"]);

            string response = getDataByIndex(pageindex, pageSize);

            context.Response.Clear();
            context.Response.ContentType = "application/json";
            context.Response.Write(response);
        }

        /// <summary>
        /// 数据源分页获取
        /// </summary>
        /// <param name="pageindex"></param>
        /// <param name="pageSize"></param>
        /// <returns></returns>
        private string getDataByIndex(int pageindex,int pageSize)
        {
            var jList = new List<Demo>();

            int startIndex = (pageindex - 1)*pageSize + 1;
            int endIndex = (pageindex - 1)*pageSize + 1 + pageSize;
            
            for (int i = startIndex; i < endIndex; i++)
            {
                jList.Add(new Demo() {Id = i,Name = "name+" + i, Age = 2});
            }

            /*{"total":0,"items":[]}*/
            var obj = new { total = 10000, items = jList };
            string response = JsonConvert.SerializeObject(obj);

            return response;
        }

        public bool IsReusable
        {
            get
            {
                return false;
            }
        }
    }


    internal class Demo
    {
        public int Id { set; get; }
        public string Name { set; get; }
        public int Age { set; get; }
    }


}